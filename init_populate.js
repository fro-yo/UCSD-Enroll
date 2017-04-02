var socsjs = require('socsjs');

var quarter = 'FA16';
var dept = 'CSE';
var timeout = 10000;
var undergrad = true;   // optional boolean to select only undergrad courses (< 200)
socsjs.searchDepartment(quarter, dept, timeout, undergrad).then(function(result) {
    var deptObj = {};
    for (var courseNum in result) {
        var course = result[courseNum];
        if (course.department !== null) {

            // if course not encountered
            if (deptObj [course.code] === undefined) {
                console.log ('creating' + course.code);
                deptObj[course.code] = {};
                deptObj[course.code]['name'] = course.name;
                deptObj [course.code]['lectures'] = [];
            }

            for (sectionNum in course.sections) {
                var section = course.sections[sectionNum];
                if (section.type === 'lecture') {
                    deptObj [course.code]['lectures'].push (section);
                }
            }
        }
    }

    console.log (deptObj);
}).catch(function(err) {
    console.log(err, 'oops!');
});
