var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var dateFormat = require('dateformat');
// var conn = mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   password:'111111',
//   port:'3306',
//   database:'d1'
// });

var conn = mysql.createConnection({
  host: "nodedemoonazuredb.mysql.database.azure.com",
  user: "dayoung@nodedemoonazuredb",
  password: 'ralraL0967!!',
  database: 'd0',
  port: 3306
});
conn.connect();

var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }))

app.locals.pretty= true;

app.get('/review/add', function(req, res){
  var sql = 'select distinct title from review';
  conn.query(sql, function(err, titles, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {titles:titles});
  });

});

app.post('/review', function(req, res){
  var title = req.body.title;
  var year = req.body.year;
  var semester = req.body.semester;
  var prof = req.body.prof;
  var review = req.body.review;
  var date = new Date();
  if(title){
    var sql = 'insert into review(title,year,semester,prof,review,r_date) values(?,?,?,?,?,?)'
    conn.query(sql, [title,year,semester,prof,review, date], function(err, rows, fields){
      if(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
      }
      else{
        res.redirect('/review');
      }
    })
  }
  else{
    res.redirect('/review');
  }

});
app.get('/', function(req, res){
  res.redirect('/review');
})
app.get(['/review', '/review/:title'], function(req, res){
  // fs.readdir('data', function(err, files){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   var id = req.params.id;
  //   if(id){
  //     fs.readFile('data/'+id, 'utf-8', function(err, data){
  //       if(err){
  //         console.log(err);
  //         res.status(500).send('Internal Server Error');
  //       }
  //       else{
  //         res.render('view', {topics:files, description:data, title:id});
  //     }})
  //   }
  //   else{
  //     res.render('view', {topics:files, description:'Hello Server Side Javascript', title:'Hello'});
  //   }
  // })
  var sql = 'select distinct title from review';
  conn.query(sql, function(err, titles, fields){
    var title = req.params.title;
    if(title){
      var sql="select * from review where title=? order by year "
      conn.query(sql, [title], function(err, title_reviews, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.render('view', {titles:titles, title_reviews:title_reviews, fields:fields})
        }
      });
    }else{
      res.render('view', {titles:titles});
    }
  });
});

app.get('/review/edit/:id', function(req, res){
  var id = req.params.id;
  var sql = 'select distinct title from review';
  conn.query(sql, function(err, titles, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    if(id){
      var e_sql='select * from review where id=?'
      conn.query(e_sql, [id], function(err, e_review, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else{
          console.log(e_review);
          res.render('add', {titles:titles, e_review:e_review});
        }
      });
    }
    else{
      res.render('add', {titles:titles});
    }
  });
});

app.post('/review/edit/:id', function(req, res){
  var id = req.params.id;
  var title = req.body.title;
  var year = req.body.year;
  var semester = req.body.semester;
  var prof= req.body.prof;
  var review = req.body.review;
  var sql = 'select distinct title from review';
  conn.query(sql, function(err, titles, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    if(id){
      var sql = 'UPDATE review SET title=?, year=?, semester=?, prof=?, review=? WHERE id=?';
      conn.query(sql, [title, year, semester, prof, review, id], function(err, result, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.redirect('/review/'+title);
        }
      });
    }
});
});
app.listen(process.env.PPORT || 3000);
// app.listen(3000, function(req, res){
//   console.log('Connected 3000 port');
// });


// get('topic/') : view.jade
// get('topic/add') : add.jade
//   post('topic/add')
//   get('topic/:id')
// get('topic/:id/edit') :edit.jade
//   post('topic/:id/edit')
//   get('topic/:id')
// get('topic/:id/delete') :delete.jade
//   post('topic/:id/delete')
//   get('topic/')
