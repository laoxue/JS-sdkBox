const gulp = require("gulp");
const tsc = require("gulp-typescript");
const tsProject = tsc.createProject("tsconfig.json");
const del = require("del")
// 每次删除dist的文件
function clean () {
    return del(['dist']);
};

function tsCompiler() {
    return tsProject.src()
            .pipe(tsProject())
            .js.pipe(gulp.dest("dist"))
}

function watcher() {
    gulp.watch('src/*.ts', gulp.series(tsCompiler));
}

const serve = gulp.series(clean,tsCompiler,watcher);

gulp.task('default',serve)