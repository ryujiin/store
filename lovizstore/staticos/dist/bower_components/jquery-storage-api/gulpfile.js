var gulp=require("gulp"),uglify=require("gulp-uglify"),rename=require("gulp-rename");gulp.task("compress",function(){return gulp.src("./jquery.storageapi.js").pipe(uglify({preserveComments:function(e,t){return/Licensed under/.test(t.value)}})).pipe(rename("jquery.storageapi.min.js")).pipe(gulp.dest("./"))});