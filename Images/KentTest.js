console.log(dartsSolver([2, 3, 4, 7, 8, 9], 4, 25));

function dartsSolver(zones, darts, targetScore, currPath = []) {
    let currCount = 0;
    if (currPath.length >= 1) { currCount = currPath.reduce(function (total, num) { return total + num; }) }
    let Tester = [];
    let Answers = [];
    for (i = 0; i < zones.length; i++) {
        let Testpath = currPath;
        if (currCount + zones[i] <= targetScore) {
            if (currPath.length < 1 || zones[i] >= currPath[currPath.length - 1]) {
                Testpath.push(zones[i]);
                if (Testpath.reduce(function (total, num) { return total + num; }) < targetScore && (darts - 1) > 0) {
                    console.log(darts - 1);
                    Tester = dartsSolver(zones, darts - 1, targetScore, Testpath);
                    if (Tester.length != 0) {
                        Tester.forEach(function (ans) { Answers.push(ans) });
                    }
                }
                else if ((darts - 1) == 0 && Testpath.reduce(function (total, num) { return total + num; }) == targetScore) {
                    Answers.push(Tester.join('-'));
                }
            }
        }
    }
    return Answers;
}