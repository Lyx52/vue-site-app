import dateTime from 'date-and-time';
import userService from "@/services/user.service";
import { saveAs } from 'file-saver';
const timePattern = dateTime.compile("mm:ss.SS");
const zeroTime = dateTime.parse("00:00.00", timePattern);
export default {
    toMilliseconds(timeString)
    {
        if (timeString === '')
            return 0;
        return dateTime.subtract(this.toTimeObject(timeString), zeroTime).toMilliseconds()
    },
    fromMilliseconds(ms) {
        if (isNaN(ms))
            return '';
        return dateTime.format(dateTime.addMilliseconds(zeroTime, ms), timePattern);
    },
    toTimeObject(timeString) {
        let time = dateTime.parse(timeString, timePattern);
        return isNaN(time) ? zeroTime : time;
    },
    printTable(tableDiv) {
        let printWindow = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
        printWindow.document.write(
            tableDiv.outerHTML
        );
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    },
    downloadTable(genderID, tableID, authToken, fileName) {
        userService.downloadTable(genderID, tableID, authToken)
            .then(response => {
                // Log somewhat to show that the browser actually exposes the custom HTTP header
                const fileNameHeader = "x-suggested-filename";
                const suggestedFileName = response.headers[fileNameHeader];
                const effectiveFileName = (suggestedFileName === undefined ? `${fileName}_${genderID < 0 ? 'kopa' : genderID > 0 ? 'jaunietes' : 'jauniesi'}.xlsx` : suggestedFileName);
                console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);

                // Let the user save the file.
                saveAs(response.data, effectiveFileName);
            })
            .catch(err => {
                console.log(`RESPONSE: ${err.data.message}`);
            })
    },
    sortTable(ctx, tableData, schoolNames) {
        return tableData.sort((a, b) => {

            // Get schoolResult/schoolName
            let sortByA = a[ctx.sortBy];
            let sortByB = b[ctx.sortBy];

            if (!isNaN(ctx.sortBy)) {
                // If var is 0 set it to Infinity to push it back
                sortByA = sortByA === 0 ? Infinity : sortByA;
                sortByB = sortByB === 0 ? Infinity : sortByB;
            } else if (ctx.sortBy === 'schoolID') {
                    // Convert from SchoolID/school > SchoolName
                    sortByA = schoolNames.filter(item => item.schoolID === sortByA)[0].name;
                    sortByB = schoolNames.filter(item => item.schoolID === sortByB)[0].name;
            }

            if (sortByA < sortByB) {
                return ctx.sortDesc ? 1 : -1;
            }
            if (sortByA > sortByB) {
                return ctx.sortDesc ? -1 : 1;
            }

            // fields must be equal
            return 0;
        });
    }
}


