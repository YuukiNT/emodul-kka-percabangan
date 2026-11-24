/**
 * pythonLiteRunner.js - Runner Python percabangan ringan secara luring
 * Menjalankan penetapan variabel, percabangan if/elif/else, dan print(...)
 * lengkap dengan deteksi error sintaks & indentasi berbahasa Indonesia.
 */

function parseValue(raw, env) {
  const trimmed = raw.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === 'True') return true;
  if (trimmed === 'False') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (Object.prototype.hasOwnProperty.call(env, trimmed)) return env[trimmed];
  return undefined;
}

function evalCondition(condStr, env, lineNo) {
  const s = condStr.trim();

  // Cek jebakan pemula: memakai = tunggal di dalam if/elif
  if (/(^|[^=!<>])=([^=]|$)/.test(s)) {
    return {
      error: {
        code: 'SyntaxError',
        line: lineNo,
        title: `Baris ${lineNo}: Memakai "=" tunggal pada kondisi`,
        cause: `Di dalam syarat kondisi tertulis "${s}" dengan satu tanda sama dengan (=).`,
        fix: 'Gunakan dua tanda sama dengan (==) untuk membandingkan apakah kedua nilai sama.',
      },
    };
  }

  const match = s.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) {
    const singleVal = parseValue(s, env);
    if (singleVal === undefined) {
      return {
        error: {
          code: 'NameError',
          line: lineNo,
          title: `Baris ${lineNo}: Variabel atau kondisi belum dikenali`,
          cause: `Bagian "${s}" belum didefinisikan atau format perbandingannya belum lengkap.`,
          fix: 'Pastikan nama variabel sudah diberi nilai sebelumnya dan memakai operator seperti >=, <=, >, <, ==, atau !=.',
        },
      };
    }
    return { value: Boolean(singleVal) };
  }

  const left = parseValue(match[1], env);
  const op = match[2];
  const right = parseValue(match[3], env);

  if (left === undefined || right === undefined) {
    const missing = left === undefined ? match[1].trim() : match[3].trim();
    return {
      error: {
        code: 'NameError',
        line: lineNo,
        title: `Baris ${lineNo}: Variabel "${missing}" belum diberi nilai`,
        cause: `Komputer tidak menemukan nilai untuk "${missing}".`,
        fix: `Periksa ejaan nama variabel atau tambahkan baris seperti ${missing} = 80 di bagian atas.`,
      },
    };
  }

  switch (op) {
    case '==': return { value: left === right };
    case '!=': return { value: left !== right };
    case '>': return { value: left > right };
    case '<': return { value: left < right };
    case '>=': return { value: left >= right };
    case '<=': return { value: left <= right };
    default: return { value: false };
  }
}

export function runPythonBranching(code) {
  const rawLines = String(code || '').replace(/\r\n/g, '\n').split('\n');
  const env = {};
  const outputs = [];

  let i = 0;
  while (i < rawLines.length) {
    const raw = rawLines[i];
    const lineNo = i + 1;
    const withoutComment = raw.replace(/#.*$/, '');
    const trimmed = withoutComment.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const indent = raw.match(/^(\s*)/)[1].replace(/\t/g, '    ').length;
    if (indent > 0) {
      return {
        ok: false,
        outputs,
        error: {
          code: 'IndentationError',
          line: lineNo,
          title: `Baris ${lineNo}: Jarak spasi tidak terduga`,
          cause: 'Baris ini menjorok ke kanan padahal tidak berada langsung di bawah if, elif, atau else.',
          fix: 'Hapus spasi di awal baris agar sejajar di tepi kiri.',
        },
      };
    }

    // Cek struktur if ... :
    if (/^if\b/.test(trimmed)) {
      if (!trimmed.endsWith(':')) {
        return {
          ok: false,
          outputs,
          error: {
            code: 'SyntaxError',
            line: lineNo,
            title: `Baris ${lineNo}: Lupa tanda titik dua (:) di akhir if`,
            cause: `Baris "${trimmed}" belum ditutup dengan titik dua (:).`,
            fix: `Tambahkan tanda : di ujung baris menjadi -> ${trimmed}:`,
          },
        };
      }

      // Kumpulkan seluruh rantai if / elif / else
      const chain = [];
      let cursor = i;

      while (cursor < rawLines.length) {
        const curRaw = rawLines[cursor];
        const curLineNo = cursor + 1;
        const curTrim = curRaw.replace(/#.*$/, '').trim();
        const curIndent = curRaw.match(/^(\s*)/)[1].replace(/\t/g, '    ').length;

        if (!curTrim) {
          cursor += 1;
          continue;
        }

        if (curIndent === 0 && (/^(if|elif|else)\b/.test(curTrim))) {
          if (chain.length > 0 && curTrim.startsWith('if ')) {
            break;
          }
          if (!curTrim.endsWith(':')) {
            return {
              ok: false,
              outputs,
              error: {
                code: 'SyntaxError',
                line: curLineNo,
                title: `Baris ${curLineNo}: Lupa tanda titik dua (:)`,
                cause: `Baris "${curTrim}" wajib diakhiri titik dua (:).`,
                fix: `Tambahkan tanda : di akhir baris -> ${curTrim}:`,
              },
            };
          }

          let kind = 'else';
          let cond = null;
          if (curTrim.startsWith('if ')) {
            kind = 'if';
            cond = curTrim.slice(3, -1).trim();
          } else if (curTrim.startsWith('elif ')) {
            kind = 'elif';
            cond = curTrim.slice(5, -1).trim();
          } else if (curTrim !== 'else:') {
            return {
              ok: false,
              outputs,
              error: {
                code: 'SyntaxError',
                line: curLineNo,
                title: `Baris ${curLineNo}: Penulisan else kurang tepat`,
                cause: 'Cabang else tidak memakai syarat kondisi lagi.',
                fix: 'Cukup tulis: else:',
              },
            };
          }

          const body = [];
          cursor += 1;
          while (cursor < rawLines.length) {
            const bRaw = rawLines[cursor];
            const bTrim = bRaw.replace(/#.*$/, '').trim();
            if (!bTrim) {
              cursor += 1;
              continue;
            }
            const bIndent = bRaw.match(/^(\s*)/)[1].replace(/\t/g, '    ').length;
            if (bIndent === 0) {
              break;
            }
            body.push({ lineNo: cursor + 1, text: bTrim });
            cursor += 1;
          }

          if (body.length === 0) {
            return {
              ok: false,
              outputs,
              error: {
                code: 'IndentationError',
                line: curLineNo + 1,
                title: `Baris ${curLineNo + 1}: Baris di bawah ${kind} belum menjorok`,
                cause: `Perintah di dalam cabang ${kind} tidak diberi jarak indentasi (4 spasi).`,
                fix: 'Tambahkan 4 spasi atau tekan Tab di awal baris print(...) di bawahnya.',
              },
            };
          }

          chain.push({ kind, cond, lineNo: curLineNo, body });
        } else {
          break;
        }
      }

      // Eksekusi rantai if / elif / else
      for (const branch of chain) {
        let shouldRun = false;
        if (branch.kind === 'else') {
          shouldRun = true;
        } else {
          const evalRes = evalCondition(branch.cond, env, branch.lineNo);
          if (evalRes.error) {
            return { ok: false, outputs, error: evalRes.error };
          }
          shouldRun = evalRes.value;
        }

        if (shouldRun) {
          for (const stmt of branch.body) {
            const execErr = executeStatement(stmt.text, stmt.lineNo, env, outputs);
            if (execErr) return { ok: false, outputs, error: execErr };
          }
          break;
        }
      }

      i = cursor;
      continue;
    }

    // Statement tunggal tingkat atas (assignment atau print)
    const stmtErr = executeStatement(trimmed, lineNo, env, outputs);
    if (stmtErr) return { ok: false, outputs, error: stmtErr };
    i += 1;
  }

  return { ok: true, outputs, env };
}

function executeStatement(text, lineNo, env, outputs) {
  const printMatch = text.match(/^print\s*\((.*)\)$/);
  if (printMatch) {
    const inner = printMatch[1].trim();
    if (!inner) {
      outputs.push('');
      return null;
    }
    const val = parseValue(inner, env);
    if (val === undefined) {
      return {
        code: 'SyntaxError',
        line: lineNo,
        title: `Baris ${lineNo}: Format isi print() belum tepat`,
        cause: `Bagian print(${inner}) belum memakai tanda kutip yang lengkap atau variabel tidak dikenal.`,
        fix: 'Jika ingin mencetak teks, apit dengan tanda kutip ganda, contoh: print("Lulus KKM").',
      };
    }
    outputs.push(String(val));
    return null;
  }

  const assignMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
  if (assignMatch) {
    const varName = assignMatch[1];
    const val = parseValue(assignMatch[2], env);
    if (val === undefined) {
      return {
        code: 'SyntaxError',
        line: lineNo,
        title: `Baris ${lineNo}: Nilai variabel "${varName}" tidak dikenali`,
        cause: `Nilai "${assignMatch[2]}" belum berupa angka atau teks bertanda kutip.`,
        fix: `Gunakan angka (misal ${varName} = 84) atau teks berkutip (misal ${varName} = "Cerah").`,
      };
    }
    env[varName] = val;
    return null;
  }

  return {
    code: 'SyntaxError',
    line: lineNo,
    title: `Baris ${lineNo}: Perintah belum dikenali`,
    cause: `Baris "${text}" tidak sesuai pola penetapan variabel, if/elif/else, atau print(...).`,
    fix: 'Periksa kembali ejaan perintah seperti print("...") atau if nilai >= 75:.',
  };
}
