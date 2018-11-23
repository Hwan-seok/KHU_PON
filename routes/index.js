var express = require('express');
var router = express.Router();
const db = require('../lib/db.js');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('lib/config.json');

const s3 = new AWS.S3();
let multer = require("multer");
let multerS3 = require('multer-s3');

// let upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "khupon",
//     key: function (req, file, cb) {
//       let extension = path.extname(file.originalname);
//       cb(null, Date.now().toString() + extension)
//     },
//     acl: 'public-read-write',
//   })
// })
let upload = multer({
  dest: "/"
})
 


출처: http://victorydntmd.tistory.com/39 [victolee]


router.get('/adList', function (req, res, next) {
  const sql = "SELECT * FROM ad";
  db.query(sql, (err, ad) => {
    res.render('adList', {
      ad //광고 전체 배열 => 안에 객체들이 들어있음
    });
  })
});

router.get('/submitAd', function (req, res, next) {
  res.render('submitAd');
});

router.post('/submitAd', upload.single("file"), function (req, res, next) {
  const info = req.body;
  const company = info.company;
  const title = info.title;
  const content = info.content;
  console.log(req.files);

  const sql = "INSERT INTO ad ('title', 'content', 'file','company') VALUES (?,?,?,?)";
  db.query(sql, [title, content, image, company], (err, result) => {
    db.query("SELECT LAST_INSERT_ID()",(err,id)=>{
      console.log(id);
    res.redirect(`/${id}`);
  });
  })
});
// s3_aws.addFile = function(files, dir){
//   var params = {Bucket: "khupon", Key: dir, Body: files};
//   s3.upload(params).on('httpUploadProgress', function (evt) { console.log(evt); }).
//       send(function (err, data) {
//         //S3 File URL
//         var url = data.Location
//         console.log(url);
//         //어디에서나 브라우저를 통해 접근할 수 있는 파일 URL을 얻었습니다.
//       })
// }

  /* GET home page. */
  router.get('/:id', function (req, res, next) {
    let sql;
    
    console.log(req.params.id);
    if (req.id == -1) {
       sql = "SELECT * FROM ad order by rand() limit 1";
    } else {
       sql = `SELECT * FROM ad WHERE id =${req.params.id}`
    }  // ad = { num:",,,", title:" ,, " , description : "@22" , image : "###"}
    
    db.query(sql, (err, ad) => {
      console.log(ad);
      const company = ad[0].company;
      const title = ad[0].title; //db 에서 불러온 이름
      const content = ad[0].content;
      const imgURL = ad[0].file; //s3 주소
      const imgCheck = ad[0].imgCheck;
      res.render('home', {
        company,
        title,
        content,
        imgURL,
        imgCheck
      });
    })
  });

module.exports = router;
