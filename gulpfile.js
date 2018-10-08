const gulp = require("gulp"),
	minifyCss = require("gulp-clean-css"),
	uglify = require("gulp-uglify"),
	htmlmin = require("gulp-htmlmin"),
	babel = require("gulp-babel"),
	connect = require("gulp-connect");

// 压缩CSS
gulp.task("css", ()=>{
	gulp.src("src/css/*.css")
		.pipe(minifyCss())
		.pipe(gulp.dest("dist/css"))
		.pipe(connect.reload());
});

// 压缩JS
gulp.task("js", ()=>{
	gulp.src("src/js/*.js")
		.pipe(babel({
            presets: ['env']
        }))
		.pipe(uglify())
		.pipe(gulp.dest("dist/js"))
		.pipe(connect.reload());
});

// 压缩HTML
gulp.task("html", ()=>{
	gulp.src("src/**/*.html")
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest("dist"))
		.pipe(connect.reload());
});

// 复制任务
gulp.task("copy-img", ()=>{
	gulp.src("src/img/**/*.*")
		.pipe(gulp.dest("dist/img"));
});
gulp.task("copy-lib", ()=>{
	gulp.src("src/lib/**/*.*")
		.pipe(gulp.dest("dist/lib"));
});
gulp.task("copy", ["copy-img", "copy-lib"]);

// webserver
gulp.task("webserver", ()=>{
	connect.server({
	    root: 'dist',
	    livereload: true
	});
});

// 监视任务
gulp.task("watch", ()=>{
	gulp.watch("src/css/*.css", ["css"]);
	gulp.watch("src/js/*.js", ["js"]);
	gulp.watch("src/**/*.html", ["html"]);
});

// 默认、缺省任务
gulp.task("default", ["css", "js", "html", "copy", "webserver", "watch"]);