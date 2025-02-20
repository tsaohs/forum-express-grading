const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') // 引入資料庫
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport.js')
const app = express()
const port = process.env.PORT || 3000

// 設定 view engine 使用 handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())  

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // console.log(req.user)
  res.locals.user = req.user
  next()
})


require('./routes')(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// require('./routes')(app)

module.exports = app
