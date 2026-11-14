function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.idGuru = e.parameter.guru || ''; 
  template.idPembina = e.parameter.pembina || ''; 
  return template.evaluate()
    .setTitle('Portal Guru & Ekskul - SMPIT Thoriqul Jannah')
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/3224/3224151.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// =========================================================================
// HELPER DATA SPREADSHEET (TOLERAN & ANTI-GESER KOLOM)
// =========================================================================
function getFullData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return null;
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) return [];
  return sheet.getRange(1, 1, lastRow, lastCol).getValues();
}

function getColumnLetter(colIndex1Based) {
  let temp, letter = '';
  while (colIndex1Based > 0) {
    temp = (colIndex1Based - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex1Based = Math.floor((colIndex1Based - temp - 1) / 26);
  }
  return letter;
}

// Helper normalisasi tanggal kanonikal (YYYY-MM-DD) kebal terhadap pergeseran timezone
function normalizeDateYMD(val) {
  if (!val) return "";
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return "";
    return Utilities.formatDate(val, Session.getScriptTimeZone() || "Asia/Jakarta", "yyyy-MM-dd");
  }
  let s = String(val).trim();
  // Format ISO / YYYY-MM-DD
  let isoMatch = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    let y = isoMatch[1];
    let m = isoMatch[2].padStart(2, "0");
    let d = isoMatch[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  // Format DD/MM/YYYY atau DD-MM-YYYY
  let dmyMatch = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    let d = dmyMatch[1].padStart(2, "0");
    let m = dmyMatch[2].padStart(2, "0");
    let y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }
  let parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone() || "Asia/Jakarta", "yyyy-MM-dd");
  }
  return s;
}

// Kamus & Detektor Hari Libur Nasional Resmi Indonesia (SKB 3 Menteri)
function getInfoLiburNasional(dateStr) {
  if (!dateStr) return null;
  const ymd = normalizeDateYMD(dateStr);
  if (!ymd) return null;

  const HOLIDAYS = {
    // 2024
    "2024-01-01": "Tahun Baru 2024 Masehi",
    "2024-02-08": "Isra Mikraj Nabi Muhammad SAW",
    "2024-02-10": "Tahun Baru Imlek 2575 Kongzili",
    "2024-03-11": "Hari Suci Nyepi (Tahun Baru Saka 1946)",
    "2024-03-29": "Wafat Yesus Kristus (Jumat Agung)",
    "2024-03-31": "Hari Paskah",
    "2024-04-10": "Hari Raya Idul Fitri 1445 H",
    "2024-04-11": "Hari Raya Idul Fitri 1445 H",
    "2024-05-01": "Hari Buruh Internasional",
    "2024-05-09": "Kenaikan Yesus Kristus",
    "2024-05-23": "Hari Raya Waisak 2568 BE",
    "2024-06-01": "Hari Lahir Pancasila",
    "2024-06-17": "Hari Raya Idul Adha 1445 H",
    "2024-07-07": "Tahun Baru Islam 1446 H",
    "2024-08-17": "Hari Kemerdekaan RI (HUT RI)",
    "2024-09-16": "Maulid Nabi Muhammad SAW",
    "2024-12-25": "Hari Raya Natal",
    // 2025
    "2025-01-01": "Tahun Baru 2025 Masehi",
    "2025-01-27": "Isra Mikraj Nabi Muhammad SAW",
    "2025-01-29": "Tahun Baru Imlek 2576 Kongzili",
    "2025-03-29": "Hari Suci Nyepi (Tahun Baru Saka 1947)",
    "2025-03-31": "Hari Raya Idul Fitri 1446 H",
    "2025-04-01": "Hari Raya Idul Fitri 1446 H",
    "2025-04-18": "Wafat Yesus Kristus (Jumat Agung)",
    "2025-04-20": "Hari Paskah",
    "2025-05-01": "Hari Buruh Internasional",
    "2025-05-12": "Hari Raya Waisak 2569 BE",
    "2025-05-29": "Kenaikan Yesus Kristus",
    "2025-06-01": "Hari Lahir Pancasila",
    "2025-06-06": "Hari Raya Idul Adha 1446 H",
    "2025-06-27": "Tahun Baru Islam 1447 H",
    "2025-08-17": "Hari Kemerdekaan RI (HUT RI)",
    "2025-09-05": "Maulid Nabi Muhammad SAW",
    "2025-12-25": "Hari Raya Natal",
    // 2026
    "2026-01-01": "Tahun Baru 2026 Masehi",
    "2026-01-16": "Isra Mikraj Nabi Muhammad SAW",
    "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
    "2026-03-19": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
    "2026-03-20": "Hari Raya Idul Fitri 1447 H",
    "2026-03-21": "Hari Raya Idul Fitri 1447 H",
    "2026-04-03": "Wafat Yesus Kristus (Jumat Agung)",
    "2026-05-01": "Hari Buruh Internasional",
    "2026-05-14": "Kenaikan Yesus Kristus",
    "2026-05-27": "Hari Raya Idul Adha 1447 H",
    "2026-05-31": "Hari Raya Waisak 2570 BE",
    "2026-06-01": "Hari Lahir Pancasila",
    "2026-06-16": "Tahun Baru Islam 1448 H",
    "2026-08-17": "Hari Kemerdekaan RI (HUT RI)",
    "2026-08-25": "Maulid Nabi Muhammad SAW",
    "2026-12-25": "Hari Raya Natal",
    // 2027
    "2027-01-01": "Tahun Baru 2027 Masehi",
    "2027-01-05": "Isra Mikraj Nabi Muhammad SAW",
    "2027-02-06": "Tahun Baru Imlek 2578 Kongzili",
    "2027-03-09": "Hari Raya Idul Fitri 1448 H",
    "2027-03-10": "Hari Raya Idul Fitri 1448 H",
    "2027-03-26": "Wafat Yesus Kristus (Jumat Agung)",
    "2027-04-08": "Hari Suci Nyepi (Tahun Baru Saka 1949)",
    "2027-05-01": "Hari Buruh Internasional",
    "2027-05-06": "Kenaikan Yesus Kristus",
    "2027-05-16": "Hari Raya Idul Adha 1448 H",
    "2027-05-20": "Hari Raya Waisak 2571 BE",
    "2027-06-01": "Hari Lahir Pancasila",
    "2027-06-06": "Tahun Baru Islam 1449 H",
    "2027-08-15": "Maulid Nabi Muhammad SAW",
    "2027-08-17": "Hari Kemerdekaan RI (HUT RI)",
    "2027-12-25": "Hari Raya Natal"
  };

  if (HOLIDAYS[ymd]) {
    return { isHoliday: true, nama: HOLIDAYS[ymd] };
  }

  // Live fallback jika di lingkungan Google Apps Script dan CalendarApp aktif
  if (typeof CalendarApp !== 'undefined') {
    try {
      const cal = CalendarApp.getCalendarById("id.indonesian#holiday@group.v.calendar.google.com");
      if (cal) {
        let parts = ymd.split('-');
        let dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        let events = cal.getEventsForDay(dObj);
        if (events && events.length > 0) {
          return { isHoliday: true, nama: events[0].getTitle() };
        }
      }
    } catch (e) {}
  }

  return null;
}

function getColIndex(headers, colName) {
  if (!headers || headers.length === 0) return -1;

  // Fase 1: Exact match (case-insensitive & trimmed)
  if (Array.isArray(colName)) {
    for (let name of colName) {
      let idx = headers.findIndex(h => h && h.toString().trim().toLowerCase() === name.toLowerCase());
      if (idx !== -1) return idx;
    }
  } else {
    let idx = headers.findIndex(h => h && h.toString().trim().toLowerCase() === colName.toLowerCase());
    if (idx !== -1) return idx;
  }

  // Fase 2: Toleran pembersihan karakter (misal "ID_Guru" == "ID Guru")
  const cleanStr = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (Array.isArray(colName)) {
    for (let name of colName) {
      let target = cleanStr(name);
      let idx = headers.findIndex(h => cleanStr(h) === target);
      if (idx !== -1) return idx;
    }
  } else {
    let target = cleanStr(colName);
    let idx = headers.findIndex(h => cleanStr(h) === target);
    if (idx !== -1) return idx;
  }

  // Fase 3: Partial substring match (hanya untuk kata kunci panjang >= 4 dengan proteksi false-positive)
  const isExcluded = (targetStr, headerStr) => {
    // Cegah salah tangkap kolom Nama Ayah/Ibu/Wali ketika mencari Nama Siswa
    if (targetStr.includes("nama") && (headerStr.includes("ayah") || headerStr.includes("ibu") || headerStr.includes("wali") || headerStr.includes("ortu"))) {
      return true;
    }
    return false;
  };

  if (Array.isArray(colName)) {
    for (let name of colName) {
      if (name.length < 4) continue;
      let target = name.toLowerCase();
      let idx = headers.findIndex(h => {
        if (!h) return false;
        let str = h.toString().trim().toLowerCase();
        if (isExcluded(target, str)) return false;
        return str.includes(target);
      });
      if (idx !== -1) return idx;
    }
  } else if (colName.length >= 4) {
    let target = colName.toLowerCase();
    let idx = headers.findIndex(h => {
      if (!h) return false;
      let str = h.toString().trim().toLowerCase();
      if (isExcluded(target, str)) return false;
      return str.includes(target);
    });
    if (idx !== -1) return idx;
  }

  return -1;
}

// Menemukan baris header tabel. Prioritaskan baris 4 (index 3) sesuai standar template B4 sekolah!
function findHeaderRowIndex(data2D, requiredHeaders) {
  if (!data2D || data2D.length === 0) return -1;

  // 1. PRIORITAS UTAMA: Baris 4 (index 3 di array) — standar resmi format tabel B4
  if (data2D.length >= 4) {
    let row4 = data2D[3];
    let matchCount4 = 0;
    for (let h of requiredHeaders) {
      if (getColIndex(row4, h) !== -1) matchCount4++;
    }
    if (matchCount4 === requiredHeaders.length) return 3;
  }

  // 2. FALLBACK FLEKSIBEL: Jika pengguna membuat sheet di baris lain (misal baris 1, 2, 3, atau 5)
  for (let r = 0; r < data2D.length; r++) {
    if (r === 3) continue; // Sudah diperiksa di prioritas 1
    let row = data2D[r];
    let matchCount = 0;
    for (let h of requiredHeaders) {
      if (getColIndex(row, h) !== -1) matchCount++;
    }
    if (matchCount === requiredHeaders.length) return r; 
  }
  return -1;
}

// =========================================================================
// MODUL 1: JURNAL HARIAN WALI KELAS (100% AMAN & PRESERVATIF)
// =========================================================================
function getAllGuru() {
  const wsGuru = getFullData("Master_Guru");
  if (!wsGuru || wsGuru.length === 0) return { error: "Sheet Master_Guru kosong." };
  
  const hIdx = findHeaderRowIndex(wsGuru, ["ID_Guru", "Nama_Guru"]);
  if (hIdx === -1) return { error: "Header 'ID_Guru' atau 'Nama_Guru' tidak ditemukan di tabel." };
  
  const headers = wsGuru[hIdx];
  const idIdx = getColIndex(headers, ["ID_Guru", "ID Guru", "NIP"]);
  const namaIdx = getColIndex(headers, ["Nama_Guru", "Nama Guru"]);
  const kelasIdx = getColIndex(headers, ["ID_Kelas", "ID Kelas", "Kelas", "Wali_Kelas"]);
  
  let list = [];
  for (let i = hIdx + 1; i < wsGuru.length; i++) {
    // Ambil guru yang memiliki kelas (Wali Kelas)
    if (idIdx !== -1 && wsGuru[i][idIdx] && (kelasIdx === -1 || wsGuru[i][kelasIdx])) {
      list.push({ id: wsGuru[i][idIdx], nama: wsGuru[i][namaIdx] });
    }
  }
  return { success: true, data: list };
}

function getFormContext(idGuru) {
  if (!idGuru) return { error: "Parameter ID Guru tidak valid." };

  const wsGuru = getFullData("Master_Guru");
  const wsKelas = getFullData("Master_Kelas");
  const wsSiswa = getFullData("Master_Siswa");

  const gHIdx = findHeaderRowIndex(wsGuru, ["Nama_Guru"]);
  if(gHIdx === -1) return { error: "Format Master_Guru salah. Pastikan header lengkap." };
  const hGuru = wsGuru[gHIdx];
  const gIdIdx = getColIndex(hGuru, ["ID_Guru", "ID Guru", "NIP"]);
  const gNamaIdx = getColIndex(hGuru, ["Nama_Guru", "Nama Guru"]);
  const gKelasIdx = getColIndex(hGuru, ["ID_Kelas", "ID Kelas", "Kelas", "Wali_Kelas"]);

  let guru = null;
  for (let i = gHIdx + 1; i < wsGuru.length; i++) {
    if (wsGuru[i][gIdIdx] == idGuru) {
      guru = { id: wsGuru[i][gIdIdx], nama: wsGuru[i][gNamaIdx], idKelas: wsGuru[i][gKelasIdx] };
      break;
    }
  }
  if (!guru) return { error: "ID Guru tidak ditemukan." };

  const kHIdx = findHeaderRowIndex(wsKelas, [["ID_Kelas", "ID Kelas"], ["Nama_Kelas", "Nama Kelas", "Kelas"]]);
  let namaKelas = guru.idKelas;
  if (kHIdx !== -1) {
    const hKelas = wsKelas[kHIdx];
    const kIdIdx = getColIndex(hKelas, ["ID_Kelas", "ID Kelas"]);
    const kNamaIdx = getColIndex(hKelas, ["Nama_Kelas", "Nama Kelas", "Kelas"]);
    for (let i = kHIdx + 1; i < wsKelas.length; i++) {
      if (wsKelas[i][kIdIdx] == guru.idKelas) {
        namaKelas = wsKelas[i][kNamaIdx];
        break;
      }
    }
  }

  const sHIdx = findHeaderRowIndex(wsSiswa, ["ID_Siswa", "Nama"]);
  if(sHIdx === -1) return { error: "Format Master_Siswa salah. Pastikan header lengkap (ada ID_Siswa dan Nama)." };
  const hSiswa = wsSiswa[sHIdx];
  const sIdIdx = getColIndex(hSiswa, ["ID_Siswa", "ID Siswa", "NISN", "NIS"]);
  const sNamaIdx = getColIndex(hSiswa, ["Nama", "Nama_Siswa", "Nama Siswa"]);
  const sKelasIdx = getColIndex(hSiswa, ["ID_Kelas", "ID Kelas", "Kelas"]);
  const sStatusIdx = getColIndex(hSiswa, ["Status", "Status_Siswa"]);

  let siswaList = [];
  for (let i = sHIdx + 1; i < wsSiswa.length; i++) {
    if (sIdIdx !== -1 && !wsSiswa[i][sIdIdx]) continue;
    if (sKelasIdx !== -1 && String(wsSiswa[i][sKelasIdx]).trim() != String(guru.idKelas).trim()) continue;
    if (sStatusIdx !== -1 && String(wsSiswa[i][sStatusIdx]).trim().toLowerCase() === "nonaktif") continue;
    siswaList.push({ idSiswa: wsSiswa[i][sIdIdx], nama: wsSiswa[i][sNamaIdx] });
  }
  siswaList.sort((a, b) => a.nama.localeCompare(b.nama));
  return { guru: guru, namaKelas: namaKelas, siswa: siswaList };
}

function getJurnalByDate(tanggal, idKelas) {
  const sheetName = "Jurnal_" + String(idKelas).trim();
  const data = getFullData(sheetName);
  if (!data || data.length === 0) return {};

  const hIdx = findHeaderRowIndex(data, ["Tanggal", "ID_Kelas", "ID_Siswa"]);
  if(hIdx === -1) return {};
  
  const hJurnal = data[hIdx];
  const dDateIdx = getColIndex(hJurnal, "Tanggal");
  const dKelasIdx = getColIndex(hJurnal, "ID_Kelas");
  const dSiswaIdx = getColIndex(hJurnal, "ID_Siswa");
  const dSubuhIdx = getColIndex(hJurnal, "Subuh");
  const dDhuhurIdx = getColIndex(hJurnal, "Dhuhur");
  const dAsharIdx = getColIndex(hJurnal, "Ashar");
  const dMagribIdx = getColIndex(hJurnal, "Magrib");
  const dIsyaIdx = getColIndex(hJurnal, "Isya");
  const dMengajiIdx = getColIndex(hJurnal, "Mengaji");
  const dBantuIdx = getColIndex(hJurnal, "Bantu_OT");
  const dGadgetIdx = getColIndex(hJurnal, ["Gadget", "Main Gadget", "Kecanduan", "Main HP"]);

  let tglInput = normalizeDateYMD(tanggal);
  let existingData = {};
  
  for (let i = hIdx + 1; i < data.length; i++) {
    let rowDate = normalizeDateYMD(data[i][dDateIdx]);
    let rowIdKelas = String(data[i][dKelasIdx] || "").trim();
    
    if (rowDate === tglInput && rowIdKelas === String(idKelas).trim()) {
      let idSiswa = String(data[i][dSiswaIdx] || "").trim();
      existingData[idSiswa] = {
        subuh: data[i][dSubuhIdx] == 1, dhuhur: data[i][dDhuhurIdx] == 1, ashar: data[i][dAsharIdx] == 1,
        magrib: data[i][dMagribIdx] == 1, isya: data[i][dIsyaIdx] == 1,
        mengaji: data[i][dMengajiIdx] == 1, bantu_ot: data[i][dBantuIdx] == 1,
        gadget: data[i][dGadgetIdx] == 1
      };
    }
  }
  return existingData;
}

function simpanJurnal(tanggal, idKelas, dataJurnal) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return { error: "Server sedang sibuk. Harap coba lagi beberapa detik lagi." };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Jurnal_" + String(idKelas).trim();
    const sheetJurnal = ss.getSheetByName(sheetName);
    
    if (!sheetJurnal) return { error: `Sheet '${sheetName}' tidak ditemukan!` };

    const dataAkhir = getFullData(sheetName) || [];
    let hIdx = findHeaderRowIndex(dataAkhir, ["Tanggal", "ID_Siswa"]);
    if(hIdx === -1) return { error: "Header sheet Jurnal tidak ditemukan." };

    const headers = dataAkhir[hIdx];
    const dDateIdx = getColIndex(headers, "Tanggal");
    const dKelasIdx = getColIndex(headers, ["ID_Kelas", "ID Kelas", "Kelas"]);
    const dSiswaIdx = getColIndex(headers, "ID_Siswa");

    // Deteksi kolom awal tabel (default Kolom B = 2 jika format B4)
    let startCol = 2;
    for (let c = 0; c < headers.length; c++) {
      if (headers[c] && String(headers[c]).trim() !== "") {
        startCol = c + 1;
        break;
      }
    }

    let mapExisting = {};
    let tglInput = normalizeDateYMD(tanggal);
    let firstEmptyRow = hIdx + 2; 

    for (let i = hIdx + 1; i < dataAkhir.length; i++) {
      if (dataAkhir[i][dDateIdx] && dataAkhir[i][dDateIdx].toString().trim() !== "") {
        firstEmptyRow = i + 2;
      }
      let rowDate = normalizeDateYMD(dataAkhir[i][dDateIdx]);
      let rowKelasVal = dKelasIdx !== -1 ? String(dataAkhir[i][dKelasIdx]).trim() : String(idKelas).trim();
      if (rowDate === tglInput && rowKelasVal === String(idKelas).trim()) {
        mapExisting[String(dataAkhir[i][dSiswaIdx]).trim()] = i + 1; 
      }
    }

    for (let i = 0; i < dataJurnal.length; i++) {
      let d = dataJurnal[i];
      let sId = String(d.idSiswa).trim();
      
      let skor = 0;
      if (d.subuh) skor++; if (d.dhuhur) skor++; if (d.ashar) skor++;
      if (d.magrib) skor++; if (d.isya) skor++;
      if (d.mengaji) skor++; if (d.bantu_ot) skor++;

      let rowData = [
        new Date(), tanggal, idKelas, sId,
        d.subuh ? 1 : 0, d.dhuhur ? 1 : 0, d.ashar ? 1 : 0, d.magrib ? 1 : 0, d.isya ? 1 : 0,
        "", "", d.mengaji ? 1 : 0, d.bantu_ot ? 1 : 0, d.gadget ? 1 : 0, skor
      ];

      if (mapExisting[sId]) {
        sheetJurnal.getRange(mapExisting[sId], startCol, 1, rowData.length).setValues([rowData]);
      } else {
        sheetJurnal.getRange(firstEmptyRow, startCol, 1, rowData.length).setValues([rowData]);
        firstEmptyRow++;
      }
    }
    return { success: true, message: "Jurnal Harian berhasil disimpan!" };
  } catch (err) {
    return { error: err.message };
  } finally {
    lock.releaseLock();
  }
}

function getRekapKelas(idKelas, startDate, endDate) {
  const sheetName = "Jurnal_" + String(idKelas).trim();
  const wsJurnal = getFullData(sheetName);
  const wsSiswa = getFullData("Master_Siswa");
  if (!wsJurnal || wsJurnal.length === 0) return { error: `Belum ada data jurnal di sheet ${sheetName}.` };

  const hJIdx = findHeaderRowIndex(wsJurnal, ["Tanggal", "ID_Kelas", "ID_Siswa", "Subuh"]);
  if(hJIdx === -1) return { error: "Format sheet Jurnal salah." };
  
  const hJ = wsJurnal[hJIdx];
  const colDate = getColIndex(hJ, "Tanggal");
  const colKelas = getColIndex(hJ, "ID_Kelas");
  const colSiswa = getColIndex(hJ, "ID_Siswa");
  const colSubuh = getColIndex(hJ, "Subuh");
  const colDhuhur = getColIndex(hJ, "Dhuhur");
  const colAshar = getColIndex(hJ, "Ashar");
  const colMagrib = getColIndex(hJ, "Magrib");
  const colIsya = getColIndex(hJ, "Isya");
  const colMengaji = getColIndex(hJ, "Mengaji");
  const colBantu = getColIndex(hJ, "Bantu_OT");
  const colGadget = getColIndex(hJ, ["Gadget", "Main Gadget", "Kecanduan", "Main HP"]);

  const startStr = normalizeDateYMD(startDate);
  const endStr = normalizeDateYMD(endDate);
  
  let siswaMap = {};
  if (wsSiswa) {
    const sHIdx = findHeaderRowIndex(wsSiswa, ["ID_Siswa", ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]]);
    if (sHIdx !== -1) {
      const hS = wsSiswa[sHIdx];
      const sId = getColIndex(hS, "ID_Siswa");
      const sName = getColIndex(hS, ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]);
      for (let i = sHIdx + 1; i < wsSiswa.length; i++) {
        let key = String(wsSiswa[i][sId]).trim();
        siswaMap[key] = { nama: wsSiswa[i][sName], index: i };
      }
    }
  }

  let results = [];
  for (let i = hJIdx + 1; i < wsJurnal.length; i++) {
    if (!wsJurnal[i][colDate] || !wsJurnal[i][colSiswa]) continue;

    let rowIdKelas = String(wsJurnal[i][colKelas]).trim();
    if (rowIdKelas !== String(idKelas).trim()) continue;
    
    let tglStr = normalizeDateYMD(wsJurnal[i][colDate]);
    if (tglStr >= startStr && tglStr <= endStr) {
      let idS = String(wsJurnal[i][colSiswa]).trim();
      let nama = siswaMap[idS] ? siswaMap[idS].nama : idS;
      let orderIndex = siswaMap[idS] ? siswaMap[idS].index : 9999;
      
      results.push({
        "_order": orderIndex, "Tanggal": tglStr, "Nama Siswa": nama,
        "Subuh": wsJurnal[i][colSubuh] == 1 ? "✓" : "-", "Dhuhur": wsJurnal[i][colDhuhur] == 1 ? "✓" : "-",
        "Ashar": wsJurnal[i][colAshar] == 1 ? "✓" : "-", "Magrib": wsJurnal[i][colMagrib] == 1 ? "✓" : "-",
        "Isya": wsJurnal[i][colIsya] == 1 ? "✓" : "-", "Mengaji Al-Quran": wsJurnal[i][colMengaji] == 1 ? "✓" : "-",
        "Bantu Orang Tua": wsJurnal[i][colBantu] == 1 ? "✓" : "-", "Main Gadget": wsJurnal[i][colGadget] == 1 ? "✓" : "-"
      });
    }
  }
  
  results.sort((a, b) => a.Tanggal === b.Tanggal ? a["Nama Siswa"].localeCompare(b["Nama Siswa"]) : (a.Tanggal > b.Tanggal ? 1 : -1));
  results.forEach(r => delete r._order);
  return { success: true, data: results };
}

function getRekapSiswa(idKelas, idSiswa, startDate, endDate) {
  const res = getRekapKelas(idKelas, startDate, endDate);
  if (res.error) return res;
  
  const wsSiswa = getFullData("Master_Siswa");
  const sHIdx = findHeaderRowIndex(wsSiswa, ["ID_Siswa", ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]]);
  if (sHIdx === -1) return { error: "Master_Siswa tidak valid." };
  const hS = wsSiswa[sHIdx];
  const sIdCol = getColIndex(hS, "ID_Siswa");
  const sNameCol = getColIndex(hS, ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]);
  
  let namaSiswa = null;
  for (let i = sHIdx + 1; i < wsSiswa.length; i++) {
    if (String(wsSiswa[i][sIdCol]).trim() === String(idSiswa).trim()) {
      namaSiswa = wsSiswa[i][sNameCol];
      break;
    }
  }
  if (!namaSiswa) return { error: "Siswa tidak ditemukan." };
  return { success: true, data: res.data.filter(r => r["Nama Siswa"] === namaSiswa), namaSiswa: namaSiswa };
}

// =========================================================================
// MODUL 2: ABSENSI EKSKUL & TANDA TANGAN DIGITAL (SINGLE-SOURCE RELASIONAL)
// =========================================================================

// Mengambil daftar pembina dari Master_Guru untuk Portal Dropdown
function getAllPembina() {
  const wsGuru = getFullData("Master_Guru");
  if (!wsGuru || wsGuru.length === 0) return { error: "Sheet Master_Guru kosong atau belum ada." };

  const hIdx = findHeaderRowIndex(wsGuru, ["Nama_Guru"]);
  if (hIdx === -1) return { error: "Header 'Master_Guru' tidak valid (harus ada minimal kolom Nama_Guru)." };

  const headers = wsGuru[hIdx];
  const idGuruIdx = getColIndex(headers, ["ID_Guru", "ID Guru", "NIP"]);
  const namaIdx = getColIndex(headers, "Nama_Guru");
  const idPembinaIdx = getColIndex(headers, ["ID_Pembina", "ID Pembina", "Kode_Pembina", "Pembina_Ekskul", "Ekskul"]);

  if (idPembinaIdx === -1) {
    return { error: "Kolom 'ID_Pembina' belum ditemukan di sheet Master_Guru." };
  }

  let list = [];
  for (let i = hIdx + 1; i < wsGuru.length; i++) {
    let idPb = String(wsGuru[i][idPembinaIdx] || "").trim();
    let namaG = String(wsGuru[i][namaIdx] || "").trim();
    let idG = idGuruIdx !== -1 ? String(wsGuru[i][idGuruIdx] || "").trim() : "";
    
    // Hanya masukkan guru yang memiliki ID_Pembina (tidak kosong dan bukan tanda strip "-")
    if (idPb && idPb !== "-") {
      list.push({
        idPembina: idPb,
        idGuru: idG,
        nama: namaG || idPb
      });
    }
  }

  if (list.length === 0) {
    return { error: "Belum ada guru yang diisi kolom 'ID_Pembina'-nya di Master_Guru." };
  }

  return { success: true, data: list };
}

function getFolderArsipTTD() {
  const FOLDER_NAME = "Arsip_TTD_Ekskul";
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

// Normalisasi kode teks (menghilangkan spasi, strip, underscore, dan case-insensitive)
function cleanCode(val) {
  return String(val || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Normalisasi jenis kelamin (L atau P)
function normalizeJenisKelamin(val) {
  if (!val) return "-";
  let s = String(val).trim().toUpperCase();
  if (s.startsWith("L") || s.includes("PRIA") || s.includes("LAKI")) return "L";
  if (s.startsWith("P") || s.includes("WANITA") || s.includes("PEREMPUAN")) return "P";
  return "-";
}

// Memuat data ekskul dan memfilter siswa dari Master_Siswa (Toleran Multi-Fallback)
function getEkskulContext(idPembinaInput) {
  const wsGuru = getFullData("Master_Guru");
  const wsEkskul = getFullData("Master_Ekskul");
  const wsSiswa = getFullData("Master_Siswa");

  if (!wsEkskul || wsEkskul.length === 0) {
    return { error: "Sheet 'Master_Ekskul' belum dibuat atau masih kosong." };
  }

  // 1. Identifikasi Guru / Pembina dari Master_Guru
  const gHIdx = findHeaderRowIndex(wsGuru, ["Nama_Guru"]);
  if (gHIdx === -1) return { error: "Format 'Master_Guru' salah (harus ada kolom Nama_Guru)." };
  
  const hG = wsGuru[gHIdx];
  const gIdCol = getColIndex(hG, ["ID_Guru", "ID Guru"]);
  const gNamaCol = getColIndex(hG, "Nama_Guru");
  const gPembinaCol = getColIndex(hG, ["ID_Pembina", "ID Pembina", "Kode_Pembina", "Pembina_Ekskul", "Ekskul"]);

  let pembina = null;
  const inputClean = cleanCode(idPembinaInput);
  const inputRawUpper = String(idPembinaInput || "").trim().toUpperCase();

  for (let i = gHIdx + 1; i < wsGuru.length; i++) {
    let r = wsGuru[i];
    let cellPb = gPembinaCol !== -1 ? String(r[gPembinaCol] || "").trim() : "";
    let cellNama = String(r[gNamaCol] || "").trim();
    let cellId = gIdCol !== -1 ? String(r[gIdCol] || "").trim() : "";

    if (
      cleanCode(cellPb) === inputClean ||
      cellPb.toUpperCase() === inputRawUpper ||
      (cellId && cleanCode(cellId) === inputClean) ||
      cellNama.toUpperCase() === inputRawUpper
    ) {
      pembina = {
        idPembina: cellPb || cellId,
        idGuru: cellId,
        nama: cellNama
      };
      break;
    }
  }

  if (!pembina) {
    return { error: `Data guru dengan ID/Pembina '${idPembinaInput}' tidak ditemukan di sheet Master_Guru.` };
  }

  // 2. Identifikasi Ekskul dari Master_Ekskul (Multi-Fallback Cerdas & Toleran)
  const eHIdx = findHeaderRowIndex(wsEkskul, ["ID_Ekskul"]);
  if (eHIdx === -1) return { error: "Format 'Master_Ekskul' salah (harus ada minimal kolom ID_Ekskul)." };

  const hE = wsEkskul[eHIdx];
  const eIdCol = getColIndex(hE, ["ID_Ekskul", "ID Ekskul", "Kode_Ekskul"]);
  const eNamaCol = getColIndex(hE, ["Nama_Ekskul", "Nama Ekskul", "Ekskul"]);
  const ePbCol = getColIndex(hE, ["ID_Pembina", "ID Pembina", "Kode_Pembina", "Pembina"]);
  const eNamaPbCol = getColIndex(hE, ["Nama_Pembina", "Nama Pembina"]);
  const eKolomSiswaCol = getColIndex(hE, ["Kolom_Siswa", "Kolom Siswa"]);

  let ekskul = null;
  let daftarEkskulDebug = [];

  const targetPbClean = cleanCode(pembina.idPembina);
  const targetIdGuruClean = cleanCode(pembina.idGuru);
  const targetNamaUpper = pembina.nama.toUpperCase().trim();

  for (let i = eHIdx + 1; i < wsEkskul.length; i++) {
    let r = wsEkskul[i];
    let rowIdEkskul = eIdCol !== -1 ? String(r[eIdCol] || "").trim() : "";
    if (!rowIdEkskul) continue;

    let rowNamaEkskul = eNamaCol !== -1 && r[eNamaCol] ? String(r[eNamaCol]).trim() : rowIdEkskul;
    let rowIdPb = ePbCol !== -1 ? String(r[ePbCol] || "").trim() : "";
    let rowNamaPb = eNamaPbCol !== -1 ? String(r[eNamaPbCol] || "").trim() : "";
    let rowKolomSiswa = eKolomSiswaCol !== -1 && r[eKolomSiswaCol] ? String(r[eKolomSiswaCol]).trim() : "";

    daftarEkskulDebug.push(`{Ekskul: "${rowIdEkskul}", ID_Pembina: "${rowIdPb || '-'}"}`);

    // Level 1: Match persis ID_Pembina (toleran spasi/dash/underscore: PB_CODING == PB-CODING == PB CODING)
    if (rowIdPb && targetPbClean && cleanCode(rowIdPb) === targetPbClean) {
      ekskul = {
        idEkskul: rowIdEkskul,
        namaEkskul: rowNamaEkskul,
        kolomSiswa: rowKolomSiswa || rowIdEkskul
      };
      break;
    }

    // Level 2: Fallback jika di Master_Guru kolom ID_Pembina diisi ID_Ekskul (misal diisi "CODING")
    if (targetPbClean && cleanCode(rowIdEkskul) === targetPbClean) {
      ekskul = {
        idEkskul: rowIdEkskul,
        namaEkskul: rowNamaEkskul,
        kolomSiswa: rowKolomSiswa || rowIdEkskul
      };
      break;
    }

    // Level 3: Fallback jika di Master_Ekskul kolom ID_Pembina diisi ID_Guru (misal "G01")
    if (targetIdGuruClean && rowIdPb && cleanCode(rowIdPb) === targetIdGuruClean) {
      ekskul = {
        idEkskul: rowIdEkskul,
        namaEkskul: rowNamaEkskul,
        kolomSiswa: rowKolomSiswa || rowIdEkskul
      };
      break;
    }

    // Level 4: Fallback jika di Master_Ekskul tertulis nama guru beliau (misal "Muhammad Lutfil Hakim")
    if (
      (rowNamaPb && rowNamaPb.toUpperCase().includes(targetNamaUpper)) ||
      (rowNamaPb && targetNamaUpper.includes(rowNamaPb.toUpperCase())) ||
      (rowIdPb && rowIdPb.toUpperCase().includes(targetNamaUpper)) ||
      (rowIdPb && targetNamaUpper.includes(rowIdPb.toUpperCase()))
    ) {
      ekskul = {
        idEkskul: rowIdEkskul,
        namaEkskul: rowNamaEkskul,
        kolomSiswa: rowKolomSiswa || rowIdEkskul
      };
      break;
    }
  }

  // Jika setelah 4 lapis pencarian masih belum cocok, beri pesan diagnostik jelas
  if (!ekskul) {
    let debugInfo = daftarEkskulDebug.length > 0 
      ? daftarEkskulDebug.join(", ") 
      : "(Sheet Master_Ekskul belum memiliki baris data ekskul)";
    return { 
      error: `Ekskul untuk pembina '${pembina.nama}' belum cocok di Master_Ekskul.

` +
             `Sistem mencari kode ID_Pembina: '${pembina.idPembina}'.
` +
             `Data yang terbaca di Master_Ekskul saat ini: ${debugInfo}.

` +
             `Solusi: Buka sheet 'Master_Ekskul', pastikan baris ekskul sudah ada, lalu samakan isi kolom 'ID_Pembina' menjadi '${pembina.idPembina}'.`
    };
  }

  // 3. Filter Siswa dari Master_Siswa yang memiliki angka 1 di kolom Ekskul
  const sHIdx = findHeaderRowIndex(wsSiswa, ["ID_Siswa", "Nama"]);
  if (sHIdx === -1) return { error: "Header sheet Master_Siswa tidak valid (harus ada ID_Siswa dan Nama)." };

  const hS = wsSiswa[sHIdx];
  const sIdCol = getColIndex(hS, "ID_Siswa");
  const sNamaCol = getColIndex(hS, "Nama");
  const sKelasCol = getColIndex(hS, ["ID_Kelas", "Kelas"]);
  const sStatusCol = getColIndex(hS, "Status");
  const sJkCol = getColIndex(hS, ["Jenis_Kelamin", "Jenis Kelamin", "JK", "Gender", "L/P", "Sex"]);

  let sEkskulCol = getColIndex(hS, ekskul.kolomSiswa || ekskul.idEkskul);
  if (sEkskulCol === -1) {
    sEkskulCol = getColIndex(hS, ekskul.idEkskul);
  }
  if (sEkskulCol === -1) {
    sEkskulCol = getColIndex(hS, ekskul.namaEkskul);
  }

  if (sEkskulCol === -1) {
    return { 
      error: `Kolom siswa untuk ekskul '${ekskul.namaEkskul}' (dicari kolom: '${ekskul.kolomSiswa || ekskul.idEkskul}') belum ditemukan di sheet Master_Siswa.\n\n` +
             `Solusi: Tambahkan kolom baru '${ekskul.kolomSiswa || ekskul.idEkskul}' di sheet Master_Siswa dan isi angka 1 untuk siswa yang ikut.` 
    };
  }

  let anggotaList = [];
  for (let i = sHIdx + 1; i < wsSiswa.length; i++) {
    let r = wsSiswa[i];
    if (!r[sIdCol]) continue;
    if (sStatusCol !== -1 && String(r[sStatusCol]).trim().toLowerCase() === "nonaktif") continue;

    let flagVal = r[sEkskulCol];
    if (flagVal == 1 || String(flagVal).trim() === "1" || flagVal === true || String(flagVal).toLowerCase() === "true") {
      anggotaList.push({
        idSiswa: String(r[sIdCol]).trim(),
        nama: String(r[sNamaCol]).trim(),
        kelas: sKelasCol !== -1 ? String(r[sKelasCol]).trim() : "-",
        jenisKelamin: sJkCol !== -1 ? normalizeJenisKelamin(r[sJkCol]) : "-"
      });
    }
  }

  anggotaList.sort((a, b) => a.nama.localeCompare(b.nama));

  return {
    success: true,
    pembina: pembina,
    ekskul: ekskul,
    siswa: anggotaList
  };
}
function simpanJurnalEkskul(payload) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return { error: "Server sedang sibuk. Harap coba lagi beberapa detik lagi." };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Jurnal_Ekskul_" + payload.idEkskul.trim().toUpperCase();
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Format resmi tabel B4 (Judul di B2, Header di B4:K4)
      sheet.getRange("B2").setValue("JURNAL & PRESENSI EKSTRAKURIKULER: " + payload.idEkskul.trim().toUpperCase())
        .setFontWeight("bold").setFontSize(12);
      const headerCols = ["Timestamp", "Tanggal", "ID_Siswa", "Nama_Siswa", "Kelas", "Status", "Materi", "Catatan", "Link_TTD", "Preview_TTD"];
      sheet.getRange(4, 2, 1, headerCols.length).setValues([headerCols])
        .setFontWeight("bold").setBackground("#f1f5f9");
    }

    const dataAkhir = getFullData(sheetName) || [];
    let hIdx = findHeaderRowIndex(dataAkhir, ["Tanggal", "ID_Siswa", "Status"]);
    if (hIdx === -1) return { error: `Header di sheet '${sheetName}' tidak valid.` };

    const headers = dataAkhir[hIdx];
    const dDateCol = getColIndex(headers, "Tanggal");
    const dSiswaCol = getColIndex(headers, "ID_Siswa");
    const dLinkCol = getColIndex(headers, ["Link_TTD", "Link TTD", "TTD", "Signature"]);

    // Deteksi kolom awal tabel secara dinamis (default Kolom B = 2 jika B4)
    let tableStartCol = 2;
    for (let c = 0; c < headers.length; c++) {
      if (headers[c] && String(headers[c]).trim() !== "") {
        tableStartCol = c + 1;
        break;
      }
    }

    // Tentukan huruf kolom Link_TTD untuk formula IMAGE secara dinamis
    let linkColLetter = "J"; // Default J (kolom 10) jika B4
    if (dLinkCol !== -1) {
      linkColLetter = getColumnLetter(dLinkCol + 1);
    }

    let folderArsip = getFolderArsipTTD();
    let mapExisting = {};
    let tglTarget = normalizeDateYMD(payload.tanggal);
    let firstEmptyRow = hIdx + 2; // Baris tepat di bawah header (Row 5 jika B4)

    for (let i = hIdx + 1; i < dataAkhir.length; i++) {
      let checkVal = String(dataAkhir[i][dDateCol] || dataAkhir[i][dSiswaCol] || "").trim();
      if (checkVal !== "") {
        firstEmptyRow = i + 2;
      }
      let rDate = normalizeDateYMD(dataAkhir[i][dDateCol]);
      if (rDate === tglTarget) {
        let sId = String(dataAkhir[i][dSiswaCol]).trim();
        mapExisting[sId] = i + 1;
      }
    }

    let rowsToInsert = [];
    let now = new Date();

    for (let item of payload.presensi) {
      let linkCdn = "";
      let formulaImage = "";

      // Validasi Ketat: Jika status Hadir tapi tidak ada tanda tangan digital -> otomatis 'Tidak Hadir'
      let hasValidTTD = (item.signatureBase64 && item.signatureBase64.startsWith("data:image")) || 
                        (item.existingLink && item.existingLink.startsWith("http"));
      let finalStatus = item.status || "Tidak Hadir";
      if (finalStatus === "Hadir" && !hasValidTTD) {
        finalStatus = "Tidak Hadir";
      }

      if (item.signatureBase64 && item.signatureBase64.startsWith("data:image")) {
        try {
          let base64Clean = item.signatureBase64.split(",")[1];
          let decoded = Utilities.base64Decode(base64Clean);
          let fileName = `TTD_${payload.idEkskul}_${item.idSiswa}_${payload.tanggal}.png`;
          let blob = Utilities.newBlob(decoded, "image/png", fileName);
          
          let file = folderArsip.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          linkCdn = `https://lh3.googleusercontent.com/d/${file.getId()}`;
        } catch (err) {
          linkCdn = "Error TTD: " + err.message;
        }
      } else if (item.existingLink) {
        linkCdn = item.existingLink;
      }

      let rowIdxForFormula = mapExisting[item.idSiswa] || (firstEmptyRow + rowsToInsert.length);
      if (linkCdn && linkCdn.startsWith("http")) {
        formulaImage = `=IMAGE(${linkColLetter}${rowIdxForFormula})`;
      }

      let rowData = [
        now, payload.tanggal, item.idSiswa, item.nama, item.kelas,
        finalStatus, payload.materi || "-", payload.catatan || "-",
        linkCdn, formulaImage
      ];

      if (mapExisting[item.idSiswa]) {
        sheet.getRange(mapExisting[item.idSiswa], tableStartCol, 1, rowData.length).setValues([rowData]);
      } else {
        rowsToInsert.push(rowData);
      }
    }

    if (rowsToInsert.length > 0) {
      sheet.getRange(firstEmptyRow, tableStartCol, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
    }

    return { success: true, message: "Absensi & Tanda Tangan Ekskul berhasil disimpan!" };
  } catch (error) {
    return { error: error.message };
  } finally {
    lock.releaseLock();
  }
}

function getJurnalEkskulByDate(idEkskul, tanggal) {
  const sheetName = "Jurnal_Ekskul_" + idEkskul.trim().toUpperCase();
  const data = getFullData(sheetName);
  if (!data || data.length === 0) return {};

  const hIdx = findHeaderRowIndex(data, ["Tanggal", "ID_Siswa", "Status"]);
  if (hIdx === -1) return {};

  const headers = data[hIdx];
  const dDateCol = getColIndex(headers, "Tanggal");
  const dSiswaCol = getColIndex(headers, "ID_Siswa");
  const dStatusCol = getColIndex(headers, "Status");
  const dMateriCol = getColIndex(headers, "Materi");
  const dCatatanCol = getColIndex(headers, "Catatan");
  const dLinkCol = getColIndex(headers, ["Link_TTD", "Link TTD", "TTD", "Signature"]);

  let tglInput = normalizeDateYMD(tanggal);
  let hasil = {};
  let materi = "";
  let catatan = "";

  for (let i = hIdx + 1; i < data.length; i++) {
    let rawDate = data[i][dDateCol];
    if (!rawDate) continue;
    let rDate = normalizeDateYMD(rawDate);
    if (rDate === tglInput) {
      let sId = String(data[i][dSiswaCol]).trim();
      hasil[sId] = {
        status: data[i][dStatusCol] || "Tidak Hadir",
        linkTTD: dLinkCol !== -1 ? (data[i][dLinkCol] || "") : ""
      };
      if (!materi && dMateriCol !== -1 && data[i][dMateriCol]) materi = data[i][dMateriCol];
      if (!catatan && dCatatanCol !== -1 && data[i][dCatatanCol]) catatan = data[i][dCatatanCol];
    }
  }
  return { presensi: hasil, materi: materi, catatan: catatan };
}

// =========================================================================
// REKAP BULANAN EKSKUL (BERBASIS ANCHOR TANGGAL & SIKLUS 4 PERTEMUAN SENIN-KAMIS)
// =========================================================================
function getRekapBulananEkskul(idEkskul, anchorDate, maxPertemuan) {
  const sheetName = "Jurnal_Ekskul_" + idEkskul.trim().toUpperCase();
  const data = getFullData(sheetName);
  if (!data || data.length === 0) return { error: "Belum ada riwayat absensi untuk ekskul ini." };

  const hIdx = findHeaderRowIndex(data, ["Tanggal", "ID_Siswa", "Status"]);
  if (hIdx === -1) return { error: "Header sheet jurnal ekskul tidak valid." };

  const headers = data[hIdx];
  const dDateCol = getColIndex(headers, "Tanggal");
  const dSiswaCol = getColIndex(headers, "ID_Siswa");
  const dNamaCol = getColIndex(headers, ["Nama_Siswa", "Nama"]);
  const dKelasCol = getColIndex(headers, "Kelas");
  const dStatusCol = getColIndex(headers, "Status");
  const dMateriCol = getColIndex(headers, "Materi");

  let anchorStr = anchorDate ? normalizeDateYMD(anchorDate) : "";
  let limit = maxPertemuan ? parseInt(maxPertemuan) : 16;

  // 1. Kumpulkan semua tanggal unik yang >= anchorDate
  let tglMap = {};
  for (let i = hIdx + 1; i < data.length; i++) {
    let rawDate = data[i][dDateCol];
    if (!rawDate) continue;
    let tglStr = normalizeDateYMD(rawDate);
    if (!tglStr) continue;

    if (!anchorStr || tglStr >= anchorStr) {
      let hol = getInfoLiburNasional(tglStr);
      let isLibur = hol ? true : false;
      let namaLibur = hol ? hol.nama : "";

      if (!tglMap[tglStr]) {
        tglMap[tglStr] = {
          tanggal: tglStr,
          materi: data[i][dMateriCol] || (isLibur ? `Libur Nasional: ${namaLibur}` : ""),
          isLibur: isLibur,
          namaLibur: namaLibur
        };
      } else if (!tglMap[tglStr].materi && data[i][dMateriCol]) {
        tglMap[tglStr].materi = data[i][dMateriCol];
      }
    }
  }

  // Urutkan tanggal secara kronologis (string ISO YYYY-MM-DD aman diurutkan leksikografis)
  let sortedDates = Object.values(tglMap).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  
  // Ambil hingga limit pertemuan (default 16 pertemuan untuk siklus 1 bulan 4 minggu x 4 hari)
  let selectedDates = sortedDates.slice(0, limit);
  if (selectedDates.length === 0) {
    return { error: "Tidak ditemukan data pertemuan ekskul sejak tanggal " + (anchorDate || "awal") + "." };
  }

  let activeDateKeys = selectedDates.map(item => item.tanggal);

  // Buat lookup Jenis Kelamin dari Master_Siswa (berdasarkan ID_Siswa dan Nama)
  let mapJk = {};
  let mapJkByNama = {};
  const wsSiswa = getFullData("Master_Siswa");
  if (wsSiswa && wsSiswa.length > 0) {
    let sHIdx = findHeaderRowIndex(wsSiswa, ["ID_Siswa", ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]]);
    if (sHIdx !== -1) {
      let hS = wsSiswa[sHIdx];
      let sIdCol = getColIndex(hS, "ID_Siswa");
      let sNamaCol = getColIndex(hS, ["Nama", "Nama_Siswa", "Nama Siswa", "Nama Lengkap"]);
      let sJkCol = getColIndex(hS, ["Jenis_Kelamin", "Jenis Kelamin", "JK", "Gender", "L/P", "Sex"]);
      if (sJkCol !== -1) {
        for (let r = sHIdx + 1; r < wsSiswa.length; r++) {
          let sid = String(wsSiswa[r][sIdCol] || "").trim();
          let snm = String(wsSiswa[r][sNamaCol] || "").trim().toUpperCase();
          let jkVal = normalizeJenisKelamin(wsSiswa[r][sJkCol]);
          if (sid) mapJk[sid] = jkVal;
          if (snm) mapJkByNama[snm] = jkVal;
        }
      }
    }
  }

  // 2. Kumpulkan presensi per siswa untuk pertemuan terpilih
  let siswaMap = {};
  for (let i = hIdx + 1; i < data.length; i++) {
    let rawDate = data[i][dDateCol];
    if (!rawDate) continue;
    let tglStr = normalizeDateYMD(rawDate);
    
    if (activeDateKeys.indexOf(tglStr) === -1) continue;

    let sId = String(data[i][dSiswaCol]).trim();
    if (!sId) continue;

    if (!siswaMap[sId]) {
      let sNama = String(data[i][dNamaCol] || sId).trim();
      let jk = mapJk[sId] || mapJkByNama[sNama.toUpperCase()] || "-";
      siswaMap[sId] = {
        idSiswa: sId,
        nama: sNama,
        kelas: String(data[i][dKelasCol] || "-").trim(),
        jenisKelamin: jk,
        pertemuan: {},
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpa: 0,
        libur: 0
      };
    }

    let status = String(data[i][dStatusCol] || "Tidak Hadir").trim();
    siswaMap[sId].pertemuan[tglStr] = status;
  }

  // Hitung akumulasi kehadiran, persentase, dan predikat (dengan kompensasi tanggal merah adil)
  let listSiswa = Object.values(siswaMap);
  listSiswa.forEach(s => {
    let hadir = 0, sakit = 0, izin = 0, alpa = 0, libur = 0;
    selectedDates.forEach(pt => {
      let st = s.pertemuan[pt.tanggal];
      if (st) {
        let stClean = st.toLowerCase();
        if (stClean === "hadir") hadir++;
        else if (stClean === "sakit") sakit++;
        else if (stClean === "izin") izin++;
        else if (stClean === "libur" || pt.isLibur) {
          libur++;
        } else {
          alpa++;
        }
      } else {
        if (pt.isLibur) libur++;
        else alpa++;
      }
    });

    s.hadir = hadir;
    s.sakit = sakit;
    s.izin = izin;
    s.alpa = alpa;
    s.libur = libur;

    // Total pertemuan efektif (wajib hadir) = pertemuan non-libur
    let totalEfektif = selectedDates.length - libur;
    if (totalEfektif <= 0) totalEfektif = selectedDates.length;

    s.persentase = totalEfektif > 0 ? Math.round((hadir / totalEfektif) * 100) : 0;
    
    // Predikat capaian keaktifan
    if (s.persentase >= 85) s.predikat = "A (Amat Baik)";
    else if (s.persentase >= 70) s.predikat = "B (Baik)";
    else if (s.persentase >= 55) s.predikat = "C (Cukup)";
    else s.predikat = "D (Kurang)";

    // Catatan keaktifan default
    s.keterangan = s.alpa === 0 ? "Disiplin & Aktif" : (s.hadir >= Math.ceil(totalEfektif * 0.75) ? "Cukup Aktif" : "Perlu Pembinaan");
  });

  listSiswa.sort((a, b) => a.nama.localeCompare(b.nama));

  // Hitung statistik kelas / ekskul
  let totalL = listSiswa.filter(s => s.jenisKelamin === "L").length;
  let totalP = listSiswa.filter(s => s.jenisKelamin === "P").length;
  let avgKehadiran = listSiswa.length > 0 
    ? Math.round(listSiswa.reduce((acc, cur) => acc + cur.persentase, 0) / listSiswa.length) 
    : 0;

  let totalPertemuanEfektif = selectedDates.filter(pt => !pt.isLibur).length;
  if (totalPertemuanEfektif <= 0) totalPertemuanEfektif = selectedDates.length;

  return {
    success: true,
    pertemuan: selectedDates.map(pt => ({
      tanggal: pt.tanggal,
      materi: pt.materi,
      isLibur: pt.isLibur,
      namaLibur: pt.namaLibur
    })),
    siswa: listSiswa,
    totalPertemuan: selectedDates.length,
    totalPertemuanEfektif: totalPertemuanEfektif,
    statistik: {
      totalSiswa: listSiswa.length,
      totalLaki: totalL,
      totalPerempuan: totalP,
      rataRataKehadiran: avgKehadiran
    }
  };
}
