// halscript.js
const shiurNazilM=0.60;
const shiurNazilLm=0.75;
const shiurLoNazil=0.30;
function calculateWithdrawalAmount() {
    
	document.getElementById("maxPaymentAmountResult").textContent ="";
    document.getElementById("withdrawalAmountResult").textContent ="";
    document.getElementById("withdrawalneto").textContent = "";
    document.getElementById("schomLeMeshihaBafoal").textContent = "";
    document.getElementById("nimshachMenayati").textContent ="";
    document.getElementById("nimshachLoMenayati").textContent = "";
    document.getElementById("schomLePeron").textContent = "";

	
    
    // קריאה לערכים מהקלט של המשתמש
    const zvira = parseFloat(document.getElementById("zvira").value.replace(/[^0-9.]/g, ""));
    const yitratHalvaa = parseFloat(document.getElementById("loanAmount").value.replace(/[^0-9.]/g, ""));
    let yitratLoNazil = parseFloat(document.getElementById("illiquidBalance").value.replace(/[^0-9.]/g, ""));
    let yitraNazilLOMenayot = parseFloat(document.getElementById("liquidBalanceNonStock").value.replace(/[^0-9.]/g, ""));
    let yitraNazilMenayot = parseFloat(document.getElementById("liquidBalanceStock").value.replace(/[^0-9.]/g, ""));
    const requestedAmount = parseFloat(document.getElementById("requiredWithdrawalAmount").value.replace(/[^0-9.]/g, "")); 
	let ribitzvora = parseFloat(document.getElementById("ribitzvora").value.replace(/[^0-9.]/g, "")); 

    if(!yitratHalvaa || !zvira || !requestedAmount){alert('נדרש למלא נתונים - שדה ריק למלא ב 0');return;
        } 
	if(!ribitzvora){ribitzvora=0};
	if(!yitratLoNazil){yitratLoNazil=0};
	if(!yitraNazilLOMenayot){yitraNazilLOMenayot=0};
	if(!yitraNazilMenayot){yitraNazilMenayot=0};
	
	
	
     if(zvira!==yitratLoNazil+yitraNazilLOMenayot+yitraNazilMenayot){
        alert('סכום יתרה אינו תואם לפירוט');return; 
     } 
	 
    // חישוב maxLeHalvaa
    const maxLeHalvaa = (yitratLoNazil * shiurLoNazil) + (yitraNazilMenayot * shiurNazilM) + (yitraNazilLOMenayot * shiurNazilLm);

    // חישוב sumHalvaotLoNazil
    const sumHalvaotLoNazil = yitratLoNazil * shiurLoNazil;

    // חישוב yitraHalvaaNazilLOMenayot
    const yitraHalvaaNazilLOMenayot = yitraNazilLOMenayot * shiurNazilLm;

    // חישוב yitraLeMeshichaMax (המקסימום למשיכה מתוך החישובים הקודמים)
    const yitraLeMeshichaMax = sumHalvaotLoNazil - yitratHalvaa+yitraNazilLOMenayot+yitraNazilMenayot;
	
	if (yitraLeMeshichaMax<ribitzvora){alert('אין יתרה למשיכה - יתרת ריבית צבורה גבוהה מסכום למשיכה מקסימלי');return;}
    if (requestedAmount<ribitzvora){alert('סכום מבוקש נמוך מריבית צבורה - לא ניתן לבצע');return;}
   
    // הצגת סכום מקסימום לתשלום
    document.getElementById("maxPaymentAmountResult").textContent = Math.max(yitraLeMeshichaMax,0).toLocaleString("he-IL");
    if(Number(yitraLeMeshichaMax)<=0){alert('אין יתרה פניוה למשיכה');return;}
    let amountForWithdrawalNoLoanRepayment = 0; // ערך ברירת מחדל

    // תנאים לחישוב amountForWithdrawalNoLoanRepayment
    if (maxLeHalvaa < yitratHalvaa) {
        amountForWithdrawalNoLoanRepayment = 0;
    } else if (sumHalvaotLoNazil > yitratHalvaa) {
        amountForWithdrawalNoLoanRepayment = yitraLeMeshichaMax;
    } else if (yitraHalvaaNazilLOMenayot >= (yitratHalvaa - sumHalvaotLoNazil)) {
        amountForWithdrawalNoLoanRepayment = yitraNazilLOMenayot - (yitratHalvaa - sumHalvaotLoNazil) / shiurNazilLm + yitraNazilMenayot;
    } else if (yitraHalvaaNazilLOMenayot < (yitratHalvaa - sumHalvaotLoNazil)) {
        amountForWithdrawalNoLoanRepayment = yitraNazilMenayot - (yitratHalvaa - sumHalvaotLoNazil - yitraHalvaaNazilLOMenayot) / shiurNazilM;
    }

    // הצגת סכום למשיכה ללא פרעון הלוואות
    document.getElementById("withdrawalAmountResult").textContent = amountForWithdrawalNoLoanRepayment.toLocaleString("he-IL");
    document.getElementById("withdrawalneto").textContent = Math.max(Math.min(requestedAmount, yitraLeMeshichaMax),0).toLocaleString("he-IL");



var schomLeMeshihaBafoal;
var schomLePeron;
var nimshachLoMenayati;
var nimshachMenayati;
var schomlemeshich;

if (requestedAmount < amountForWithdrawalNoLoanRepayment) {
    schomLeMeshihaBafoal = requestedAmount;
    schomLePeron = 0;

    if (yitraNazilLOMenayot > schomLeMeshihaBafoal) {
        nimshachLoMenayati = schomLeMeshihaBafoal;
        nimshachMenayati = 0;
    } else {
        nimshachLoMenayati = yitraNazilLOMenayot;
        nimshachMenayati = schomLeMeshihaBafoal - nimshachLoMenayati;
    }

} else if (requestedAmount > yitraLeMeshichaMax) {
    schomLeMeshihaBafoal = yitraNazilLOMenayot + yitraNazilMenayot;
    schomLePeron = yitratHalvaa - sumHalvaotLoNazil;

    nimshachLoMenayati = yitraNazilLOMenayot;
    nimshachMenayati = yitraNazilMenayot;

} else {
    if (yitratHalvaa > maxLeHalvaa) {
        if ((yitraNazilMenayot - (yitratHalvaa - maxLeHalvaa) / (1 - shiurNazilM)) * (1 - shiurNazilM) >= requestedAmount) {
            nimshachMenayati = (yitratHalvaa - maxLeHalvaa + requestedAmount) / (1 - shiurNazilM);
            nimshachLoMenayati = 0;
            schomLePeron = nimshachMenayati-requestedAmount;
        } else  {
            nimshachMenayati = yitraNazilMenayot;
            nimshachLoMenayati = (requestedAmount +yitratHalvaa - maxLeHalvaa - yitraNazilMenayot* (1 - shiurNazilM))   / (1 - shiurNazilLm);
            schomLePeron = nimshachMenayati + nimshachLoMenayati - requestedAmount;
        } 
    } else if (yitratHalvaa <= maxLeHalvaa && amountForWithdrawalNoLoanRepayment == 0) {
        if (yitraNazilMenayot * (1 - shiurNazilM) >= requestedAmount) {
            nimshachMenayati = requestedAmount / (1 - shiurNazilM);
            nimshachLoMenayati = 0;
            schomLePeron = requestedAmount / (1 - shiurNazilM) * shiurNazilM;
        } else if (yitraNazilMenayot * (1 - shiurNazilM) < requestedAmount) {
            nimshachMenayati = yitraNazilMenayot;
            nimshachLoMenayati = (requestedAmount - yitraNazilMenayot * (1 - shiurNazilM)) / (1 - shiurNazilLm);
            schomLePeron = yitraNazilMenayot * shiurNazilM + (requestedAmount - yitraNazilMenayot * (1 - shiurNazilM)) / (1 - shiurNazilLm) * shiurNazilLm;
        }
    } else if (yitratHalvaa <= maxLeHalvaa && amountForWithdrawalNoLoanRepayment > 0) {
        if (yitraNazilMenayot < amountForWithdrawalNoLoanRepayment) {
            nimshachMenayati = yitraNazilMenayot;
            nimshachLoMenayati = amountForWithdrawalNoLoanRepayment - yitraNazilMenayot + (requestedAmount - amountForWithdrawalNoLoanRepayment) / (1 - shiurNazilLm);
            schomLePeron = (requestedAmount - amountForWithdrawalNoLoanRepayment) / (1 - shiurNazilLm) * shiurNazilLm;
        } else if ((yitraNazilMenayot - amountForWithdrawalNoLoanRepayment) * (1 - shiurNazilM) + amountForWithdrawalNoLoanRepayment >= requestedAmount) {
            nimshachLoMenayati = 0;
            nimshachMenayati = amountForWithdrawalNoLoanRepayment + (requestedAmount - amountForWithdrawalNoLoanRepayment) / (1 - shiurNazilM);
            schomLePeron = (requestedAmount - amountForWithdrawalNoLoanRepayment) / (1 - shiurNazilM) * shiurNazilM;
        } else if ((yitraNazilMenayot - amountForWithdrawalNoLoanRepayment) * (1 - shiurNazilM) + amountForWithdrawalNoLoanRepayment < requestedAmount) {
            nimshachMenayati = yitraNazilMenayot;
            nimshachLoMenayati = (requestedAmount - amountForWithdrawalNoLoanRepayment - (yitraNazilMenayot - amountForWithdrawalNoLoanRepayment) * (1 - 0.6)) / (1 - shiurNazilLm);
            schomLePeron = (yitraNazilMenayot - amountForWithdrawalNoLoanRepayment) * shiurNazilM + nimshachLoMenayati * shiurNazilLm;
        }
    }
}
schomlemeshich=nimshachMenayati+nimshachLoMenayati;
document.getElementById("schomLeMeshihaBafoal").textContent = Math.round(schomlemeshich).toLocaleString("he-IL");
document.getElementById("nimshachMenayati").textContent = Math.round(nimshachMenayati).toLocaleString("he-IL");
document.getElementById("nimshachLoMenayati").textContent = Math.round(nimshachLoMenayati).toLocaleString("he-IL");
document.getElementById("schomLePeron").textContent =Math.round(schomLePeron).toLocaleString("he-IL");
document.getElementById("tozaa").scrollIntoView({ behavior: "smooth" });
document.getElementById("tbltozaa").style.display = "block";
document.getElementById("tozaa").style.display = "block";
document.getElementById("clearall").style.display = "block";
document.getElementById("tbltAfter").style.display = "block";
document.getElementById("aftertozaa").style.display = "block";


let zviraAfter;
let yitratHalvaaAfter;
let yitratLoNazilAfter;
let yitraNazilLOMenayotAfter;
let yitraNazilMenayotAfter;

if(schomlemeshich) {zviraAfter=zvira-schomlemeshich}
else {zviraAfter=zvira;}

if(schomLePeron)   {yitratHalvaaAfter=yitratHalvaa-schomLePeron} else {yitratHalvaaAfter=yitratHalvaa;}
yitratLoNazilAfter=yitratLoNazil;
if(nimshachLoMenayati) {yitraNazilLOMenayotAfter=yitraNazilLOMenayot-nimshachLoMenayati} else {yitraNazilLOMenayotAfter=yitraNazilLOMenayot;}
if (nimshachMenayati) {yitraNazilMenayotAfter=yitraNazilMenayot-nimshachMenayati} else {yitraNazilMenayotAfter=yitraNazilMenayot;}

document.getElementById("zviraAfter").textContent = Math.round(zviraAfter).toLocaleString("he-IL");
document.getElementById("yitratHalvaaAfter").textContent =Math.round(yitratHalvaaAfter).toLocaleString("he-IL");
document.getElementById("yitratLoNazilAfter").textContent = Math.round(yitratLoNazilAfter).toLocaleString("he-IL");
document.getElementById("yitraNazilLOMenayotAfter").textContent =Math.round(yitraNazilLOMenayotAfter).toLocaleString("he-IL");
document.getElementById("yitraNazilMenayotAfter").textContent = Math.round(yitraNazilMenayotAfter).toLocaleString("he-IL");

}
function formatNumber(input) {
    // הסרת כל תווים שאינם ספרות
    const numericValue = input.value.replace(/[^\d]/g, '');
  
    // המרת המספר לעיצוב עם פסיקים
    const formattedValue = numericValue ? parseInt(numericValue, 10).toLocaleString() : '';
  
    // עדכון השדה עם הערך המעוצב
    input.value = formattedValue;
  }
function chng(){
    document.getElementById("tbltozaa").style.display = "none";
    document.getElementById("tozaa").style.display = "none";
    document.getElementById("clearall").style.display = "none";
    document.getElementById("tbltAfter").style.display = "none";
    document.getElementById("aftertozaa").style.display = "none";
    document.getElementById("maxPaymentAmountResult").textContent ="";
    document.getElementById("withdrawalAmountResult").textContent ="";
    document.getElementById("withdrawalneto").textContent = "";
    document.getElementById("schomLeMeshihaBafoal").textContent = "";
    document.getElementById("nimshachMenayati").textContent ="";
    document.getElementById("nimshachLoMenayati").textContent = "";
    document.getElementById("schomLePeron").textContent = "";       
}
    
