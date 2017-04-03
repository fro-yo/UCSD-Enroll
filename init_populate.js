var socsjs = require('socsjs');
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ucsd-enroll.firebaseio.com"
});

var db = admin.database();

var quarter = 'FA16';
var dept = 'MATH';
var timeout = 10000;
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
                    var teacher = section.teacher.replace ('.', '');

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

    var ref = db.ref ('/'+quarter+'/'+dept);
    ref.set (deptObj).then (function () {
        console.log ('pushed!');
        process.exit (1);
    });
}).catch(function(err) {
    console.log(err, 'oops!');
});
