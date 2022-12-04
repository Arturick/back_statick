const xl = require('excel4node');
const wb = new xl.Workbook();
const productDB = require('../dto/product');

let TitleStyle = wb.createStyle({
    alignment: {
        wrapText: true,
    },

    font: {
        bold: true,
        color: '46bdc6',
        name: 'Montserrat',
        size: 24,
        b: true
    },
});
let description = wb.createStyle({
    alignment: {
        wrapText: true,
    },

    font: {
        bold: true,
        name: 'Montserrat',
        size: 14,
        b: true
    },
});
class Report {
    async test(){
        let ws = wb.addWorksheet('Sheet 1');

        ws.cell(1, 1, 1, 4, true).string('RATE THIS\nPROMOTION').style(TitleStyle);
        ws.row(1).setHeight(105);
        ws.cell(1, 5, 1, 8, true).string('Лучший сервис по работе с маркетплейсами!\nТелефон для связи +7 (499) 133-39-37\nСайт : https://rate-this.ru/').style(description);
        ws.cell(2, 1, 2, 8, true).string(`Отчет по выкупам по артикулу:`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 1).string(`Артикул`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 2).string(`Дата покупки`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 3).string(`Статус`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 4).string(`Цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 5).string(`БарКод`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 6).string(`Наименование`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 7).string(`Колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 8).string(`Бренд`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));

        wb.write('Excel.xlsx');
        return {};
    }
}

module.exports = new Report();