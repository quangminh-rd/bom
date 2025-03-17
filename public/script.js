var DocTienBangChu = function () {
    this.ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
    this.Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");
};

DocTienBangChu.prototype.docSo3ChuSo = function (baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = "";
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return "";
    if (tram != 0) {
        KetQua += this.ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += this.ChuSo[chuc] + " mươi";
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += " mốt ";
            }
            else {
                KetQua += this.ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += this.ChuSo[donvi];
            }
            else {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += this.ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}

DocTienBangChu.prototype.doc = function (SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = "";
    var tmp = "";
    var soAm = false;
    var ViTri = new Array();
    if (SoTien < 0) soAm = true;//return "Số tiền âm !";
    if (SoTien == 0) return "Không đồng";//"Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    }
    else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return "";//"Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0) {
        lan = 5;
    }
    else if (ViTri[4] > 0) {
        lan = 4;
    }
    else if (ViTri[3] > 0) {
        lan = 3;
    }
    else if (ViTri[2] > 0) {
        lan = 2;
    }
    else if (ViTri[1] > 0) {
        lan = 1;
    }
    else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = this.docSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += this.Tien[i];
        if ((i > 0) && (tmp.length > 0)) KetQua += '';//',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    if (soAm) {
        return "Âm " + KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }
    else {
        return KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }
}

function formatNumber(numberString) {
    if (!numberString) return '';
    // Loại bỏ tất cả dấu chấm
    const num = numberString.replace(/\./g, '');
    const formatted = parseFloat(num).toString();
    return formatted.replace('.', ',');
}

function formatWithCommas(numberString) {
    if (!numberString) return '';
    const num = numberString.replace(',', '.');
    return parseFloat(num).toLocaleString('it-IT');
}

const SPREADSHEET_ID = '14R9efcJ2hGE3mCgmJqi6TNbqkm4GFe91LEAuCyCa4O0';
const RANGE = 'cai_dat_bom!A:FG'; // Mở rộng phạm vi đến cột FG
const API_KEY = 'AIzaSyA9g2qFUolpsu3_HVHOebdZb0NXnQgXlFM';

// Lấy giá trị từ URI sau dấu "?" cho các tham số cụ thể
function getDataFromURI() {
    const url = window.location.href;

    // Sử dụng RegEx để trích xuất giá trị của id, xuat_tai_kho, và nhap_tai_kho
    const idURIMatch = url.match(/id=([^?&]*)/);

    // Gán các giá trị vào các biến
    const idURI = idURIMatch ? decodeURIComponent(idURIMatch[1]) : null;

    // Trả về một đối tượng chứa các giá trị
    return {
        idURI
    };
}

function extractDay(dateString) {
    if (!dateString) return '';

    // Chuẩn hóa định dạng ngày về "DD/MM/YYYY"
    const parts = dateString.split(/[-/]/); // Chấp nhận cả "-" và "/"
    if (parts.length === 3) {
        let day, month, year;

        if (parts[0].length === 4) {
            // Định dạng ban đầu là "YYYY/MM/DD" hoặc "YYYY-MM-DD"
            [year, month, day] = parts;
        } else if (parts[1].length === 4) {
            // Định dạng ban đầu là "DD/MM/YYYY" (đã đúng)
            [day, month, year] = parts;
        } else {
            // Giả định định dạng "MM/DD/YYYY"
            [month, day, year] = parts;
        }

        // Đảm bảo các phần đều đủ 2 chữ số (nếu cần)
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');

        // Chuẩn hóa thành "DD/MM/YYYY"
        dateString = `${day}/${month}/${year}`;
    }

    // Trích xuất ngày từ định dạng "DD/MM/YYYY"
    return dateString.split('/')[0];
}


// Hàm để tải Google API Client
function loadGapiAndInitialize() {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js"; // Đường dẫn đến Google API Client
    script.onload = initialize; // Gọi hàm `initialize` sau khi thư viện được tải xong
    script.onerror = () => console.error('Failed to load Google API Client.');
    document.body.appendChild(script); // Gắn thẻ script vào tài liệu
}

// Hàm khởi tạo sau khi Google API Client được tải
function initialize() {
    gapi.load('client', async () => {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
            });

            const uriData = getDataFromURI();
            if (!uriData.idURI) {
                updateContent('No valid data found in URI.');
                return;
            }

            findRowInSheet(uriData.idURI);

        } catch (error) {
            updateContent('Initialization error: ' + error.message);
            console.error('Initialization Error:', error);
        }
    });
}

// Gọi hàm tải Google API Client khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    loadGapiAndInitialize();
});

function updateContent(message) {
    const contentElement = document.getElementById('content'); // Thay 'content' bằng ID của phần tử HTML cần hiển thị
    if (contentElement) {
        contentElement.textContent = message;
    } else {
        console.warn('Element with ID "content" not found.');
    }
}


// Tìm chỉ số dòng chứa dữ liệu khớp trong cột B và lấy các giá trị từ các cột khác
let orderDetails = null; // Thông tin đơn hàng chính

async function findRowInSheet(idURI) {
    const uriData = getDataFromURI();

    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            updateContent('No data found.');
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idValue = row[0]; // Cột A

            if (idValue === idURI) {
                orderDetails = {
                    maSanpham: row[4] || '',
                    mLichsu: row[160] || '',
                    m2Lichsu: row[161] || '',
                    cLichsu: row[162] || '',
                };

                for (let j = 1; j <= 20; j++) {
                    orderDetails[`m_vt_${j}`] = row[28 + (j - 1) * 3] || '';
                    orderDetails[`kt_m_vt_${j}`] = row[29 + (j - 1) * 3] || '';
                    orderDetails[`sl_m_vt_${j}`] = row[30 + (j - 1) * 3] || '';
                }

                for (let k = 1; k <= 2; k++) {
                    orderDetails[`m2_vt_${k}`] = row[88 + (k - 1) * 4] || '';
                    orderDetails[`kt1_m2_vt_${k}`] = row[89 + (k - 1) * 4] || '';
                    orderDetails[`kt2_m2_vt_${k}`] = row[90 + (k - 1) * 4] || '';
                    orderDetails[`sl_m2_vt_${k}`] = row[91 + (k - 1) * 4] || '';
                }

                for (let m = 1; m <= 30; m++) {
                    orderDetails[`c_vt_${m}`] = row[96 + (m - 1) * 2] || '';
                    orderDetails[`sl_c_vt_${m}`] = row[97 + (m - 1) * 2] || '';
                }

                document.getElementById('maSanpham').innerHTML = orderDetails.maSanpham.replace(/\n/g, '<br>');
                document.getElementById('mLichsu').innerHTML = orderDetails.mLichsu.replace(/\n/g, '<br>');
                document.getElementById('m2Lichsu').innerHTML = orderDetails.m2Lichsu.replace(/\n/g, '<br>');
                document.getElementById('cLichsu').innerHTML = orderDetails.cLichsu.replace(/\n/g, '<br>');

                for (let j = 1; j <= 20; j++) {
                    document.getElementById(`m_vt_${j}`).innerHTML = orderDetails[`m_vt_${j}`].replace(/\n/g, '<br>');
                    document.getElementById(`kt_m_vt_${j}`).innerHTML = orderDetails[`kt_m_vt_${j}`].replace(/\n/g, '<br>');
                    document.getElementById(`sl_m_vt_${j}`).innerHTML = orderDetails[`sl_m_vt_${j}`].replace(/\n/g, '<br>');
                }

                for (let k = 1; k <= 2; k++) {
                    document.getElementById(`m2_vt_${k}`).innerHTML = orderDetails[`m2_vt_${k}`].replace(/\n/g, '<br>');
                    document.getElementById(`kt1_m2_vt_${k}`).innerHTML = orderDetails[`kt1_m2_vt_${k}`].replace(/\n/g, '<br>');
                    document.getElementById(`kt2_m2_vt_${k}`).innerHTML = orderDetails[`kt2_m2_vt_${k}`].replace(/\n/g, '<br>');
                    document.getElementById(`sl_m2_vt_${k}`).innerHTML = orderDetails[`sl_m2_vt_${k}`].replace(/\n/g, '<br>');
                }

                for (let m = 1; m <= 30; m++) {
                    document.getElementById(`c_vt_${m}`).innerHTML = orderDetails[`c_vt_${m}`].replace(/\n/g, '<br>');
                    document.getElementById(`sl_c_vt_${m}`).innerHTML = orderDetails[`sl_c_vt_${m}`].replace(/\n/g, '<br>');
                }

                return; // Dừng khi tìm thấy
            }
        }

        updateContent(`No matching data found for "${idURI}".`);
    } catch (error) {
        updateContent('Error fetching data: ' + error.message);
        console.error('Fetch Error:', error);
    }

    function updateContent(message) {
        alert(message);
    }
}

// Hàm cập nhật nội dung DOM
function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = value;
    }
}