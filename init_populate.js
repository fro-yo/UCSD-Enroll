var socsjs = require('socsjs');
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ucsd-enroll.firebaseio.com"
});

var db = admin.database();

var count = 0;
var quarter = 'SP17';
var departments=['AAS','AESE','AIP','ANAR','ANBI','ANES'	,'ANSC','ANTH','AUD','BENG','BGGN'  ,'BGJC'	,'BGRD'	,'BGSE'	,'BIBC'	,'BICD','BIEB'	,'BILD'	,'BIMM'	,'BIOM'	,'BIPN','BISP'	,'BNFO'	,'CAT','CENG','CGS','CHEM','CHIN','CLAS'	,'CLIN'	,'CLRE'	,'CLSS'	,'CMM','COGN','COGR'	,'COGS'	,'COMM'	,'CONT'	,'COSF'	,'CSE','DERM'	,'DOC','DSE','DSGN'	,'EAP','ECE','ECON','EDS','ELWR'	,'EMED'	,'ENG','ENVR'	,'ERC','ESYS'	,'ETHN'	,'EXPR'	,'FILM'	,'FMPH'	,'FPM','FPMU'	,'GLBH'	,'GMST'	,'GPCO','GPEC','GPGN','GPIM','GPLA'	,'GPPA'	,'GPPS'	,'HDP','HIAF','HIEA'	,'HIEU'	,'HIGR'	,'HILA'	,'HILD'	,'HINE'	,'HISC'	,'HITO'	,'HIUS'	,'HLAW'	,'HMNR'	,'HUM','ICAM'	,'ICEP'	,'INTL'	,'IRCO'	,'IRGN'	,'IRLA'	,'JAPN'	,'JUDA'	,'LATI'	,'LAWS'	,'LHCO','LIAB','LIDS','LIEO','LIFR','LIGM','LIGN','LIHI','LIHL','LIIT','LIPO','LISL','LISP','LTAF','LTAM','LTCH','LTCO','LTCS','LTEA','LTEN','LTEU','LTFR','LTGK','LTGM','LTHE','LTIT','LTKO','LTLA','LTPR','LTRU','LTSP','LTTH','LTWL','LTWR','MAE','MATH','MATS','MBC','MCWP','MDE','MED','MGT','MGTA','MGTF'	,'MMW','MSED'	,'MSP','MUIR'	,'MUS','NANO'	,'NEU','OPTH'	,'ORTH'	,'PATH'	,'PEDS'	,'PHAR'	,'PHIL'	,'PHYS'	,'POLI'	,'PSY','PSYC'	,'RAD','RELI'	,'REV','RMAS'	,'RMED'	,'SDCC'	,'SE','SIO','SIOB','SIOC','SIOG','SOCD'	,'SOCE'	,'SOCG'	,'SOCI'	,'SOCL'	,'SOMC'	,'SOMI','SPPS','SURG','SXTH','TDAC','TDCH','TDDE','TDDR','TDGE'	,'TDGR'	,'TDHD'	,'TDHT'	,'TDMV'	,'TDPF'	,'TDPR'	,'TDPW'	,'TDTR'	,'TMC','TWS','USP','VIS','WARR'	,'WCWP','WES']

for (var d in departments) {
    let dept = departments[d];
    var timeout = 10000000;
    var undergrad = true;
    socsjs.searchDepartment(quarter, dept, timeout, undergrad).then(function(result) {
        var deptObj = {};
        for (var courseNum in result) {
            var course = result[courseNum];
            if (course.department !== null) {

                // if course not encountered
                if (deptObj [course.code] === undefined) {
                    deptObj[course.code] = {};
                    deptObj[course.code]['name'] = course.name;
                    deptObj [course.code]['lectures'] = [];
                }

                for (sectionNum in course.sections) {
                    var section = course.sections[sectionNum];
                    if (section.id !== null && section.teacher !== null) {
                        section.openSeats = 'init',
                        section.waitlistSize = 'init'

                        // remove '.'
                        var teacher = section.teacher.replace (/\./g, '');

                        if (deptObj[course.code]['lectures'][teacher] === undefined) {
                            deptObj[course.code]['lectures'][teacher] = [section];
                        }
                        else {
                            deptObj [course.code]['lectures'][teacher].push (section);
                        }
                    }
                }
            }
        }

        let ref = db.ref ('/'+quarter+'/'+dept);
        console.log ('pushing ' + quarter + ' ' + dept);
        ref.set (deptObj).then (function () {
            console.log (count + ' ' + departments.length);
            count++;

            if (count === departments.length) {
                process.exit (1);
            }
        }).catch(function (err) {
            count++;
        });

    }).catch(function(err) {
        console.log(dept, err, 'oops!');
        count++;
    });
}
