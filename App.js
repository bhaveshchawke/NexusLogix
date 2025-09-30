const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const rootDir = require('./utils/pathUtil');
const storeRoutes = require('./Routes/storeRouter');


app.set('view engine', 'ejs')
app.set('views', 'views');
app.use(express.static(path.join(rootDir, 'public')));

app.use(storeRoutes);
app.use((req,res,next)=>{
 res.status(404).render('404',{pageTitle:'Page Not Found'})
})
app.listen(port, () => {
  console.log(`NexusLogix app listening at http://localhost:${port}`);
});
