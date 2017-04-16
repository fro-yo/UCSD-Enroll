var socsjs = require('socsjs');
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ucsd-enroll.firebaseio.com"
});

var db = admin.database();
var quarter = 'SP17';
var timeout = 100000000;
var undergrad = true;
var count = 0;
var failed = 0;

var departments=['AAS','AESE','AIP','ANAR','ANBI','ANES'	,'ANSC','ANTH','AUD','BENG','BGGN'  ,'BGJC'	,'BGRD'	,'BGSE'	,'BIBC'	,'BICD','BIEB'	,'BILD'	,'BIMM'	,'BIOM'	,'BIPN','BISP'	,'BNFO'	,'CAT','CENG','CGS','CHEM','CHIN','CLAS'	,'CLIN'	,'CLRE'	,'CLSS'	,'CMM','COGN','COGR'	,'COGS'	,'COMM'	,'CONT'	,'COSF'	,'CSE','DERM'	,'DOC','DSE','DSGN'	,'EAP','ECE','ECON','EDS','ELWR'	,'EMED'	,'ENG','ENVR'	,'ERC','ESYS'	,'ETHN'	,'EXPR'	,'FILM'	,'FMPH'	,'FPM','FPMU'	,'GLBH'	,'GMST'	,'GPCO','GPEC','GPGN','GPIM','GPLA'	,'GPPA'	,'GPPS'	,'HDP','HIAF','HIEA'	,'HIEU'	,'HIGR'	,'HILA'	,'HILD'	,'HINE'	,'HISC'	,'HITO'	,'HIUS'	,'HLAW'	,'HMNR'	,'HUM','ICAM'	,'ICEP'	,'INTL'	,'IRCO'	,'IRGN'	,'IRLA'	,'JAPN'	,'JUDA'	,'LATI'	,'LAWS'	,'LHCO','LIAB','LIDS','LIEO','LIFR','LIGM','LIGN','LIHI','LIHL','LIIT','LIPO','LISL','LISP','LTAF','LTAM','LTCH','LTCO','LTCS','LTEA','LTEN','LTEU','LTFR','LTGK','LTGM','LTHE','LTIT','LTKO','LTLA','LTPR','LTRU','LTSP','LTTH','LTWL','LTWR','MAE','MATH','MATS','MBC','MCWP','MDE','MED','MGT','MGTA','MGTF'	,'MMW','MSED'	,'MSP','MUIR'	,'MUS','NANO'	,'NEU','OPTH'	,'ORTH'	,'PATH'	,'PEDS'	,'PHAR'	,'PHIL'	,'PHYS'	,'POLI'	,'PSY','PSYC'	,'RAD','RELI'	,'REV','RMAS'	,'RMED'	,'SDCC'	,'SE','SIO','SIOB','SIOC','SIOG','SOCD'	,'SOCE'	,'SOCG'	,'SOCI'	,'SOCL'	,'SOMC'	,'SOMI','SPPS','SURG','SXTH','TDAC','TDCH','TDDE','TDDR','TDGE'	,'TDGR'	,'TDHD'	,'TDHT'	,'TDMV'	,'TDPF'	,'TDPR'	,'TDPW'	,'TDTR'	,'TMC','TWS','USP','VIS','WARR'	,'WCWP','WES']

var copy=['AAS','AESE','AIP','ANAR','ANBI','ANES'	,'ANSC','ANTH','AUD','BENG','BGGN'  ,'BGJC'	,'BGRD'	,'BGSE'	,'BIBC'	,'BICD','BIEB'	,'BILD'	,'BIMM'	,'BIOM'	,'BIPN','BISP'	,'BNFO'	,'CAT','CENG','CGS','CHEM','CHIN','CLAS'	,'CLIN'	,'CLRE'	,'CLSS'	,'CMM','COGN','COGR'	,'COGS'	,'COMM'	,'CONT'	,'COSF'	,'CSE','DERM'	,'DOC','DSE','DSGN'	,'EAP','ECE','ECON','EDS','ELWR'	,'EMED'	,'ENG','ENVR'	,'ERC','ESYS'	,'ETHN'	,'EXPR'	,'FILM'	,'FMPH'	,'FPM','FPMU'	,'GLBH'	,'GMST'	,'GPCO','GPEC','GPGN','GPIM','GPLA'	,'GPPA'	,'GPPS'	,'HDP','HIAF','HIEA'	,'HIEU'	,'HIGR'	,'HILA'	,'HILD'	,'HINE'	,'HISC'	,'HITO'	,'HIUS'	,'HLAW'	,'HMNR'	,'HUM','ICAM'	,'ICEP'	,'INTL'	,'IRCO'	,'IRGN'	,'IRLA'	,'JAPN'	,'JUDA'	,'LATI'	,'LAWS'	,'LHCO','LIAB','LIDS','LIEO','LIFR','LIGM','LIGN','LIHI','LIHL','LIIT','LIPO','LISL','LISP','LTAF','LTAM','LTCH','LTCO','LTCS','LTEA','LTEN','LTEU','LTFR','LTGK','LTGM','LTHE','LTIT','LTKO','LTLA','LTPR','LTRU','LTSP','LTTH','LTWL','LTWR','MAE','MATH','MATS','MBC','MCWP','MDE','MED','MGT','MGTA','MGTF'	,'MMW','MSED'	,'MSP','MUIR'	,'MUS','NANO'	,'NEU','OPTH'	,'ORTH'	,'PATH'	,'PEDS'	,'PHAR'	,'PHIL'	,'PHYS'	,'POLI'	,'PSY','PSYC'	,'RAD','RELI'	,'REV','RMAS'	,'RMED'	,'SDCC'	,'SE','SIO','SIOB','SIOC','SIOG','SOCD'	,'SOCE'	,'SOCG'	,'SOCI'	,'SOCL'	,'SOMC'	,'SOMI','SPPS','SURG','SXTH','TDAC','TDCH','TDDE','TDDR','TDGE'	,'TDGR'	,'TDHD'	,'TDHT'	,'TDMV'	,'TDPF'	,'TDPR'	,'TDPW'	,'TDTR'	,'TMC','TWS','USP','VIS','WARR'	,'WCWP','WES']

for (var d in departments) {

    let dept = departments[d];
    let ref = db.ref ('/'+quarter+'/'+dept);
    let oldObj = {};

    ref.once("value", function(snapshot) {
        oldObj = snapshot.val();
    }).then (function () {

        if (oldObj === null) {
            oldObj = {};
        }

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate());
        //console.log (dept);

        //console.log (JSON.stringify (oldObj, null, 4));
        socsjs.searchDepartment(quarter, dept, timeout, undergrad).then(function(result) {
            console.log (dept + result)
            for (let courseNum in result) {
                let course = result[courseNum];

                if (course.department !== null) {


                    // if course not encountered
                    if (oldObj[course.code] === undefined ) {
                        oldObj[course.code] = {};
                        oldObj[course.code]['name'] = course.name;
                        oldObj[course.code]['lectures'] = [];
                    }

                    for (let sectionNum in course.sections) {
                        let section = course.sections[sectionNum];

                        if (section.id !== null && section.teacher !== null) {
                            // remove '.'
                            let teacher = section.teacher.replace (/\./g, '');

                            if (oldObj[course.code]['lectures'][teacher] !== undefined) {
                                let oldSections = oldObj[course.code]['lectures'][teacher];

                                let i = 0;
                                let currentSection = section.section; // actual section number A00 etc

                                // finding section using id
                                while (i < oldSections.length) {
                                    if (oldSections[i]['section'] == currentSection) {
                                        break;
                                    }
                                    i++;
                                }

                                // if section found
                                if (i !== oldSections.length) {
                                    if (oldSections[i]['openSeats'] === 'init') {
                                        oldSections[i]['openSeats'] = [section.openSeats];
                                        oldSections[i]['waitlistSize'] = [section.waitlistSize];
                                        oldSections[i]['timeStamps'] = [date];
                                    }

                                    else {
                                        oldSections[i]['openSeats'].push(section.openSeats);
                                        oldSections[i]['waitlistSize'].push(section.waitlistSize);
                                        oldSections[i]['timeStamps'].push (date);
                                    }

                                    oldObj[course.code]['lectures'][teacher]= oldSections;
                                }


                                else  {
                                    section['openSeats'] = [section.openSeats];
                                    section['waitlistSize'] = [section.waitlistSize];
                                    section['timeStamps'] = [date];
                                    oldObj[course.code]['lectures'][teacher].push (section);
                                }
                            }

                            else {
                                section['openSeats'] = [section.openSeats];
                                section['waitlistSize'] = [section.waitlistSize];
                                section['timeStamps'] = [date];
                                oldObj[course.code]['lectures'][teacher] = [section];
                            }
                        }
                    }
                }

            }

            count++;
            console.log ('Update '+ dept + ' '+ count+'/'+departments.length);
            /*
            let index = copy.indexOf(dept);
            copy.splice (index, 1);

            if (count > departments.length - 5) {
                console.log (copy);
            }

            */

            ref.set (oldObj).then (function () {
                console.log ('Updated ' + dept + ' ' + quarter);
                if (count == departments.length) {
                    console.log ("Completed. Success: "+departments.length - failed+ " Failed: "+failed);
                    process.exit(0);
                }
            });

        }).catch(function(err) {
            console.log(err, 'oops!');
            count++;
            failed++;

            /*
            let index = copy.indexOf(dept);
            copy.splice (index, 1);
            */
        });
    });

}
