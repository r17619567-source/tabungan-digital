```javascript
// ================================
// TABUNGAN DIGITAL
// ================================


// Mengambil elemen HTML

const form = document.getElementById("formTabungan");

const saldoElement = document.getElementById("saldo");

const totalMasukElement =
    document.getElementById("totalMasuk");

const totalKeluarElement =
    document.getElementById("totalKeluar");

const riwayatElement =
    document.getElementById("riwayat");


// Mengambil data dari localStorage

let transaksi =
    JSON.parse(localStorage.getItem("dataTabungan")) || [];


// Menampilkan data ketika halaman dibuka

tampilkanData();


// ================================
// FORM TRANSAKSI
// ================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const nominal =
        Number(document.getElementById("nominal").value);

    const jenis =
        document.getElementById("jenis").value;

    const keterangan =
        document.getElementById("keterangan").value.trim();


    // Validasi nominal

    if (nominal <= 0) {

        alert("Nominal harus lebih dari 0!");

        return;
    }


    // Menghitung saldo saat ini

    const saldoSekarang =
        hitungSaldo();


    // Cek jika ingin menarik uang

    if (jenis === "tarik" &&
        nominal > saldoSekarang) {

        alert("Saldo tidak mencukupi!");

        return;
    }


    // Membuat transaksi baru

    const dataBaru = {

        id: Date.now(),

        nominal: nominal,

        jenis: jenis,

        keterangan:
            keterangan || "Tidak ada keterangan",

        tanggal:
            new Date().toLocaleString("id-ID")

    };


    // Memasukkan transaksi

    transaksi.push(dataBaru);


    // Menyimpan ke browser

    simpanData();


    // Menampilkan data

    tampilkanData();


    // Mengosongkan form

    form.reset();


    alert("Transaksi berhasil disimpan!");

});


// ================================
// HITUNG SALDO
// ================================

function hitungSaldo() {

    let saldo = 0;


    transaksi.forEach(function(item) {

        if (item.jenis === "setor") {

            saldo += item.nominal;

        } else {

            saldo -= item.nominal;

        }

    });


    return saldo;
}


// ================================
// HITUNG TOTAL UANG MASUK
// ================================

function hitungTotalMasuk() {

    let total = 0;


    transaksi.forEach(function(item) {

        if (item.jenis === "setor") {

            total += item.nominal;

        }

    });


    return total;
}


// ================================
// HITUNG TOTAL UANG KELUAR
// ================================

function hitungTotalKeluar() {

    let total = 0;


    transaksi.forEach(function(item) {

        if (item.jenis === "tarik") {

            total += item.nominal;

        }

    });


    return total;
}


// ================================
// FORMAT RUPIAH
// ================================

function formatRupiah(angka) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        minimumFractionDigits: 0

    }).format(angka);

}


// ================================
// TAMPILKAN DATA
// ================================

function tampilkanData() {


    // Menampilkan saldo

    const saldo = hitungSaldo();

    saldoElement.textContent =
        formatRupiah(saldo);


    // Menampilkan total masuk

    totalMasukElement.textContent =
        formatRupiah(hitungTotalMasuk());


    // Menampilkan total keluar

    totalKeluarElement.textContent =
        formatRupiah(hitungTotalKeluar());


    // Mengosongkan tabel

    riwayatElement.innerHTML = "";


    // Jika belum ada transaksi

    if (transaksi.length === 0) {

        riwayatElement.innerHTML = `

            <tr>

                <td colspan="6">
                    Belum ada transaksi
                </td>

            </tr>

        `;

        return;
    }


    // Menampilkan transaksi

    transaksi.forEach(function(item, index) {


        const row =
            document.createElement("tr");


        let jenisText;

        let nominalText;


        if (item.jenis === "setor") {

            jenisText =
                `<span class="masuk">Uang Masuk</span>`;

            nominalText =
                `<span class="masuk">
                    + ${formatRupiah(item.nominal)}
                </span>`;

        } else {

            jenisText =
                `<span class="keluar">Uang Keluar</span>`;

            nominalText =
                `<span class="keluar">
                    - ${formatRupiah(item.nominal)}
                </span>`;

        }


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${item.tanggal}
            </td>

            <td>
                ${jenisText}
            </td>

            <td>
                ${nominalText}
            </td>

            <td>
                ${escapeHTML(item.keterangan)}
            </td>

            <td>

                <button
                    class="btn-hapus"
                    onclick="hapusTransaksi(${item.id})"
                >
                    Hapus
                </button>

            </td>

        `;


        riwayatElement.appendChild(row);

    });

}


// ================================
// HAPUS SATU TRANSAKSI
// ================================

function hapusTransaksi(id) {


    const yakin = confirm(
        "Apakah Anda yakin ingin menghapus transaksi ini?"
    );


    if (!yakin) {

        return;

    }


    transaksi =
        transaksi.filter(function(item) {

            return item.id !== id;

        });


    simpanData();

    tampilkanData();

}


// ================================
// HAPUS SEMUA TRANSAKSI
// ================================

function hapusSemua() {


    if (transaksi.length === 0) {

        alert("Belum ada transaksi.");

        return;

    }


    const yakin = confirm(
        "Apakah Anda yakin ingin menghapus semua transaksi?"
    );


    if (!yakin) {

        return;

    }


    transaksi = [];


    localStorage.removeItem("dataTabungan");


    tampilkanData();

}


// ================================
// SIMPAN DATA
// ================================

function simpanData() {

    localStorage.setItem(
        "dataTabungan",
        JSON.stringify(transaksi)
    );

}


// ================================
// KEAMANAN INPUT KETERANGAN
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
```
