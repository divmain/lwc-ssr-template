const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;
const SSR_PROTOCOL = 'https:';
const isCSR = !import.meta.env.SSR;

export const urlRegexString =
    "((?:(?:https?|ftp):\\/\\/(?:[\\w\\-\\|=%~#\\/+*@\\.,;:\\?!']|&){0,2047}(?:[\\(\\)\\.\\w=\\/+#-]*)[^\\s()\\.<>,;\\[\\]`'\"])|(?:\\b(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW)(?!@(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW))(?:/[\\w\\-=?/.&;:%~,+@#*]{0,2048}(?:[\\w=/+#-]|\\([^\\s()]*\\)))?(?:$|(?=\\.$)|(?=\\.\\s)|(?=[^\\w\\.]))))";

export const emailRegexString =
    "([\\w-\\.\\+_']{1,64}@(?:[\\w-]){1,255}(?:\\.[\\w-]{1,255}){1,10})";

export const createHttpHref = function (url) {
    return makeAbsoluteUrlHere(url);
};

export const createEmailHref = function (email) {
    return `mailto:${email}`;
};

function makeAbsoluteUrlHere(url) {
    const protocol = isCSR ? window.location.protocol : SSR_PROTOCOL;
    return isAbsoluteUrl(url) ? url : `${protocol}//${url}`;
}

function isAbsoluteUrl(url) {
    return URL_CHECK_REGEX.test(url);
}