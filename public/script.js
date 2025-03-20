const SPREADSHEET_ID = '1xU6T_SAqmX65PDBIHj6LFnX6MOdRtXsbDDhKgttFtcU';
const RANGE = 'dieu_chinh_bom!A:Y';
const API_KEY = 'AIzaSyA9g2qFUolpsu3_HVHOebdZb0NXnQgXlFM';

// Lấy giá trị từ URI sau dấu "?" cho các tham số cụ thể
function getDataFromURI() {
    const url = window.location.href;

    // Sử dụng RegEx để trích xuất giá trị của maSanpham và QRCODE
    const maSanphamURIMatch = url.match(/maSanpham=([^?&]*)/);

    // Gán các giá trị vào các biến
    const maSanphamURI = maSanphamURIMatch ? decodeURIComponent(maSanphamURIMatch[1]) : null;

    // Trả về một đối tượng chứa các giá trị
    return {
        maSanphamURI
    };
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
            if (!uriData.maSanphamURI) {
                updateContent('No valid data found in URI.');
                return;
            }

            findDetailsInSheet(uriData.maSanphamURI);

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

async function findDetailsInSheet(maSanphamURI) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            updateContent('No detail data found.');
            return;
        }

        // Lọc các dòng theo maSanphamURI (giả sử ở cột F, row[4])
        const filteredRows = rows.filter(row => row[4] === maSanphamURI);

        // Nếu có ít nhất 1 dòng trùng khớp, cập nhật thông tin sản phẩm ở phần header
        if (filteredRows.length > 0) {
            // Giả sử cột thứ 5 (index 4) chứa mã sản phẩm và cột thứ 4 (index 3) chứa tên sản phẩm
            document.getElementById('maSanphamcautao').textContent = filteredRows[0][4] || '';
            document.getElementById('tenSanpham').textContent = filteredRows[0][3] || '';
        } else {
            updateContent('No product data found.');
        }

        // Tách các dòng thành 3 mảng dựa theo giá trị cột 6 (row[6] hoặc key loaiVattu)
        const rows_m = filteredRows.filter(row => row[5] && row[5].includes("m_vt"));
        const rows_m2 = filteredRows.filter(row => row[5] && row[5].includes("m2_vt"));
        const rows_c = filteredRows.filter(row => row[5] && row[5].includes("c_vt"));

        // Hiển thị dữ liệu vào bảng tương ứng nếu có dữ liệu
        if (rows_m.length > 0) {
            displayDetailData(rows_m, 'itemTableBody_m');
        } else {
            updateContent('No matching data for m_vt.');
        }
        if (rows_m2.length > 0) {
            displayDetailData(rows_m2, 'itemTableBody_m2');
        } else {
            updateContent('No matching data for m2_vt.');
        }
        if (rows_c.length > 0) {
            displayDetailData(rows_c, 'itemTableBody_c');
        } else {
            updateContent('No matching data for c_vt.');
        }
    } catch (error) {
        console.error('Error fetching detail data:', error);
        updateContent('Error fetching detail data.');
    }
}

// Hàm hiển thị dữ liệu vào bảng theo tbodyId được truyền vào
function displayDetailData(filteredRows, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ nếu có

    filteredRows.forEach((row, index) => {
        const item = extractDetailDataFromRow(row);
        let rowHtml = `<tr class="bordered-table-m">`;
        // Cột STT (số thứ tự)
        rowHtml += `<td class="borderedcol-m-1">${index + 1}</td>`;

        if (tableBodyId === 'itemTableBody_m') {
            // Bảng cho m_vt (8 cột):
            // STT, Loại vật tư, Công thức chọn mã, Diễn giải,
            // Công thức Kích thước, Diễn giải, Công thức Số lượng, Diễn giải
            rowHtml += `<td class="borderedcol-m-2">${item.loaiVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-m-3">${item.ctVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-m-4">${item.dienGiaiVt || ''}</td>`;
            // Sử dụng ctKT1 và dienGiaiKT1 cho "Công thức Kích thước"
            rowHtml += `<td class="borderedcol-m-5">${item.ctKT1 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m-6">${item.dienGiaiKT1 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m-7">${item.ctSL || ''}</td>`;
            rowHtml += `<td class="borderedcol-m-8">${item.dienGiaiSL || ''}</td>`;
        } else if (tableBodyId === 'itemTableBody_m2') {
            // Bảng cho m2_vt (10 cột):
            // STT, Loại vật tư, Công thức chọn mã, Diễn giải,
            // Công thức Kích thước 1, Diễn giải, Công thức Kích thước 2,
            // Diễn giải, Công thức Số lượng, Diễn giải
            rowHtml += `<td class="borderedcol-m2-2">${item.loaiVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-3">${item.ctVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-4">${item.dienGiaiVt || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-5">${item.ctKT1 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-6">${item.dienGiaiKT1 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-7">${item.ctKT2 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-8">${item.dienGiaiKT2 || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-9">${item.ctSL || ''}</td>`;
            rowHtml += `<td class="borderedcol-m2-10">${item.dienGiaiSL || ''}</td>`;
        } else if (tableBodyId === 'itemTableBody_c') {
            // Bảng cho c_vt (6 cột):
            // STT, Loại vật tư, Công thức chọn mã, Diễn giải,
            // Công thức Số lượng, Diễn giải
            rowHtml += `<td class="borderedcol-c-2">${item.loaiVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-c-3">${item.ctVattu || ''}</td>`;
            rowHtml += `<td class="borderedcol-c-4">${item.dienGiaiVt || ''}</td>`;
            rowHtml += `<td class="borderedcol-c-5">${item.ctSL || ''}</td>`;
            rowHtml += `<td class="borderedcol-c-6">${item.dienGiaiSL || ''}</td>`;
        }
        rowHtml += `</tr>`;
        tableBody.innerHTML += rowHtml;
    });
}


// Hàm trích xuất dữ liệu từ hàng
// Hàm trích xuất dữ liệu từ hàng và thay thế xuống dòng bằng <br>
function extractDetailDataFromRow(row) {
    return {
        maSanphamcautao: row[4] || '',
        tenSanpham: row[3] || '',
        viTri: (row[5] || '').replace(/\n/g, '<br>'),
        loaiVattu: (row[6] || '').replace(/\n/g, '<br>'),
        ctVattu: (row[7] || '').replace(/\n/g, '<br>'),
        dienGiaiVt: (row[12] || '').replace(/\n/g, '<br>'),
        ctKT1: (row[8] || '').replace(/\n/g, '<br>'),
        dienGiaiKT1: (row[13] || '').replace(/\n/g, '<br>'),
        ctKT2: (row[9] || '').replace(/\n/g, '<br>'),
        dienGiaiKT2: (row[14] || '').replace(/\n/g, '<br>'),
        ctSL: (row[10] || '').replace(/\n/g, '<br>'),
        dienGiaiSL: (row[15] || '').replace(/\n/g, '<br>')
    };
}


// Hàm cập nhật nội dung DOM thông báo lỗi, nếu cần
function updateContent(message) {
    // Ví dụ: cập nhật một element hiển thị thông báo
    const contentEl = document.getElementById('contentMessage');
    if (contentEl) {
        contentEl.innerText = message;
    }
}
