const Scholar = require("../models/scholar.model");
const Anashid = require("../models/nashids.model");
const Article = require("../models/articles.model");
const Lesson = require("../models/lessons.model");
const Moshaf = require("../models/msahf.model");
const Photos = require("../models/photos.model");
const Quotes = require("../models/quotes.model");
const Books = require("../models/books.model");
const Visits = require("../models/visits.model");
const Complaints = require("../models/complaints.model");

let url = "mongodb+srv://zizoBoy:741852@islam-data.iovdiwe.mongodb.net/all-data?retryWrites=true&w=majority"

const mongoose = require("mongoose");
const mongodb = require("mongodb");
function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
exports.getAll = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Scholar.find({}, (err, scholar) => {
            Lesson.find({}, (err, lessons) => {
                Anashid.find({}, (err, anashid) => {
                    Article.find({}, (err, articles) => {

                        Books.find({}, (err, books) => {
                            lessons.forEach(element => {
                                element.type="lessons"
                            });
                            anashid.forEach(element => {
                                element.type="anashid"
                            });
                            articles.forEach(element => {
                                element.type="articles"
                            });
                            lessons = lessons.reverse();
                            anashid = anashid.reverse();
                            articles = articles.reverse();
                            const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                            lessons.sort(function(a,b){
                                return new Date(a2e(b.date)).getTime() - new Date(a2e(a.date)).getTime();
                            })
                          anashid.sort(function(a,b){
                            return new Date(a2e(b.date)).getTime() - new Date(a2e(a.date)).getTime();
                          })
                          articles.sort(function(a,b){
                              return new Date(a2e(b.date)).getTime() - new Date(a2e(a.date)).getTime();
                            })
                            console.log(lessons[0])

                            let news = [...lessons,...anashid,...articles];
                            news.sort(function(a,b){
                                return new Date(a2e(b.date)).getTime() - new Date(a2e(a.date)).getTime();
                            })
                                         
                        
                          
                          news = news.slice(0, 30)
                          shuffle(news);
                          news.forEach(e=>{
                            e.teacherImage = scholar.find(scholar=>scholar._id ==e.teacherId).image
                          })

                          fetch('https://www.hadithapi.com/public/api/hadiths?apiKey=$2y$10$8EHnBK2R1qaeMhgIFNHuiH6OZwPRX5ICH4rSHoQQxAZmTJHFFS&page='+Math.floor((Math.random() * 1625) + 1)) // api for the get request
    .then(response => response.json())
    .then(data =>{
                            res.render("index", {
                                scholars: scholar,
                                lessons: lessons,
                                articles: articles,
                                anashid: anashid,
                                books: books,
                                news:news,
                                ahadith:data.hadiths.data,
                                path: "/"
                            })
                        });
                        })
                    })

                })
            })

        })


    })



}
exports.scholars = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Scholar.find({}, (err, scholars) => {
            let arr = "أابتثجحخدذرزسشصضطظعغفقكلمنوهي"
            scholars.sort(function (a, b) {
                let x = arr.indexOf(a.name.trim()[0])
                let y = arr.indexOf(b.name.trim()[0])
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                Visits.find({ path: req.path }, (err, vesits) => {

                    res.render("scholars", {
                        data: scholars,
                        path: req.path,
                        vesits: vesits ? vesits.length : 0
                    })
                })
            })
            mongoose.disconnect()


        })

    })
}
exports.getScholar = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Scholar.findOne({ _id: req.params.id }, (err, scholar) => {
            Lesson.find({ teacherId: req.params.id }, (err, lessons) => {
                Anashid.find({ teacherId: req.params.id }, (err, anashid) => {
                    Article.find({ teacherId: req.params.id }, (err, articles) => {
                        Books.find({ teacherId: req.params.id }, (err, books) => {
                            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
                            visit.save((err, resu) => {
                                Visits.find({ path: req.path }, (err, vesits) => {
                                    res.render("scholar", {
                                        scholar: scholar,
                                        lessons: lessons,
                                        articles: articles,
                                        anashid: anashid,
                                        books: books,
                                        path: req.path,
                                        vesits: vesits ? vesits.length : 0
                                    })
                                })
                            })
                        })
                    })

                })
            })

        })


    })



}

exports.getInScholar = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        let type;
        if (req.params.type == "lessons") { type = Lesson } else
            if (req.params.type == "audios") { type = Audio } else
                if (req.params.type == "articles") { type = Article } else
                    if (req.params.type == "books") { type = Books } else
                        if (req.params.type == "anashid") { type = Anashid }
        type.findOne({ _id: req.params.typeid }, (err, subject) => {

            Scholar.findOne({ _id: req.params.id }, (err, man) => {
                let visit = new Visits({ path: "/" + req.params.id + "/" + req.params.type + "/" + req.params.typeid, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
                visit.save((err, resu) => {
                    Visits.find({ path: "/" + req.params.id + "/" + req.params.type + "/" + req.params.typeid }, (err, vesits) => {
                        mongoose.disconnect()
                        res.render("subject", {
                            subject: subject,
                            man: man,
                            type: req.params.type,
                            path: req.path,
                            vesits: vesits ? vesits.length : 0
                        })
                    })
                })
            })
        })

    })

}
exports.goAdd = (req, res, next) => {
    res.render("add")

}
exports.moshaf = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Moshaf.find({}, (err, msahf) => {

            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("moshaf", {
                    data: msahf,
                    path: req.path
                })
            })
        })
    })

}
exports.getAnashid = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Anashid.find({}, (err, data) => {

            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("anashid", {
                    data: data,
                    path: req.path
                })
            })
        })
    })

}

exports.getArticles = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Article.find({}, (err, data) => {

            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("articles", {
                    data: data,
                    path: req.path
                })
            })
        })
    })

}

exports.getLessons = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Lesson.find({}, (err, data) => {

            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()

                res.render("lessons", {
                    data: data,
                    path: req.path
                })
            })
        })
    })
}
exports.getBooks = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Books.find({}, (err, data) => {

            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("books", {
                    data: data,
                    path: req.path
                })
            })
        })
    })
}
exports.getAzan = (req, res, next) => {
    let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
    visit.save((err, resu) => {
        res.render("azan", {

            path: req.path
        })
    })

}

exports.getPhotos = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Photos.find({}, (err, data) => {
            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("photos", {
                    data: data,
                    path: req.path
                })
            })
        })
    })
}
exports.getQuotes = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Quotes.find({}, (err, data) => {
            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("quotes", {
                    data: data,
                    path: req.path
                })
            })
        })
    })
}
exports.getComplaints = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Complaints.find({}, (err, data) => {
            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                mongoose.disconnect()
                res.render("complaints", {
                    data: data,
                    path: req.path
                })
            })
        })
    })
}
exports.getOnePhoto = (req, res, next) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
        Photos.findOne({ _id: req.params.id }, (err, data) => {
            let visit = new Visits({ path: req.path, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() })
            visit.save((err, resu) => {
                Visits.find({ path: req.path }, (err, vesits) => {
                    mongoose.disconnect()
                    res.render("photo", {
                        data: data,
                        path: "/photos",
                        vesits: vesits ? vesits.length : 0
                    })
                })
            })
        })
    })
}