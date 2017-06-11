var gulp=require("gulp");
var uglify=require("gulp-uglify");//js压缩
var minify=require("gulp-minify-css");
var htmlmin=require("gulp-htmlmin");
var concat=require("gulp-concat");
var sass=require("gulp-sass");//sass编译
var imagemin=require("gulp-imagemin");//img压缩
var webserver=require("gulp-webserver");//web服务热启动
var browserify=require("gulp-browserify");//模块打包
var url=require("url");
var data=require("./data/data.js");
var rev = require('gulp-rev');//- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');//- 路径替换

//js文件
gulp.task("jsmin",function(){
	gulp.src("src/js/*.js")
		//.pipe(concat("common.js"))
		.pipe(browserify({
			insertGlobals:true,
			debug: !gulp.env.production
		}))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("bound/js/"))
		.pipe(rev.manifest())//生成一个rev.manifesr.json
		.pipe(gulp.dest('./rev/js'))//将rev.manifesr.json存放到的路径
})

//css文件
gulp.task("cssmin",function(){
	gulp.src("src/css/*.css")
		.pipe(minify())
		.pipe(gulp.dest("bound/css/"))
})

//html文件
gulp.task("htmlmin",function(){
	gulp.src("src/html/*.html")
		.pipe(htmlmin({collapseWhitespace:true}))
		.pipe(gulp.dest("bound/html/"))
})

//sass编译压缩
gulp.task("sassmin",function(){
	return gulp.src('src/css/*.sass')
	    .pipe(sass().on('error', sass.logError))
	    .pipe(minify())
	    .pipe(gulp.dest('bound/css/'));
})
gulp.task('sass:watch', function () {
gulp.watch('src/css/*.sass', ['sass']);
});

//img压缩
gulp.task('imagemin',function(){
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('bound/images'))

});

gulp.task('replaceRev', ["jsmin"], function() {
    setTimeout(function() {
        gulp.src(['./rev/**/*.json', './src/html/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: {
                    'css': 'css/',
                    'js': 'js/',
                    // 'cdn/': function(manifest_value) {
                    //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                    // }
                }
            })) //- 执行文件内css名的替换
            .pipe(gulp.dest('./bound/html')); //- 替换后的文件输出的目录
    }, 3000)
});

//server
gulp.task('server',["jsmin","cssmin","htmlmin"], function() {
	gulp.watch("src/html/*.html",["htmlmin"])
	gulp.watch("src/css/*.sass",["sassmin"])
	gulp.watch("src/js/*.js",["jsmin"])
  	gulp.src('./bound')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      middleware:function(req,res,next){
      	//console.log(req.url)
      	//console.log(url.parse(req.url).pathname)
      	var pathName=url.parse(req.url).pathname
      	data.forEach(function(i){
      		switch(i.route){
      			case pathName:
      				{
      					i.handle(req,res,next,url)
      				}
      			break;
      		}
      	})
      	
      },
      open:"/html/index.html"
    }));
});