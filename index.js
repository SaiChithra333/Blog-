import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import express from "express"
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;
var blogs = [] ;
app.use(fileUpload());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.render('index.ejs',{
        blogs:blogs
     });
})


app.get('/create',(req,res)=>{
    res.render('create.ejs');
})
app.post('/create',(req,res)=>{
    const data = req.body;   
    const { fileimg } = req.files;

    // If no image submitted, exit
    if (!fileimg) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    fileimg.mv(__dirname + '/public/images/' + fileimg.name);
    blogs.push({
        author:data["author"],
        topic:data["topic"],
        heading:data["heading"],
        blog:data["blog"],
        fileimg:fileimg.name,  
    })
    res.redirect('/');
})

app.get('/edit',(req,res)=>{
    res.render('edit.ejs',{
        blogs:blogs
    });
})

app.get('/editinfo/:author', (req, res) => {
    const author = req.params.author;
    const reqblog = blogs.find(blog => blog.author === author);

    if (reqblog) {
        res.render('editinfo.ejs', {
            blogs: reqblog  // Pass the blog object to the view
        });
    } else {
        res.status(404).send('Blog not found');
    }
});

app.post('/editinfo/:author', (req, res) => {
    const data = req.body;
    const author = req.params.author;
    const idx = blogs.findIndex(blog => blog.author === author);

    if (idx !== -1) {
        let fileimg = blogs[idx].fileimg;  // Default to existing image

        if (req.files && req.files.fileimg) {
            const { fileimg: newImage } = req.files;
            newImage.mv(__dirname + '/public/images/' + newImage.name);
            fileimg = newImage.name;  // Update to new image if uploaded
        }

        // Update the blog with new data
        blogs[idx] = {
            author: data.author,
            topic: data.topic,
            heading: data.heading,
            blog: data.blog,
            fileimg: fileimg  // Keep the image (new or old)
        };

        res.redirect('/');  // Redirect to edit page or homepage
    } else {
        res.status(404).send('Blog not found');
    }
});

app.get('/delete/:author',(req,res)=>{
    const author = req.params.author;
    const idx = blogs.findIndex((blog)=>blog.author == author);
    if(idx!=-1){
        blogs.splice(idx,1);
        res.redirect('/');
    }
    else{
        res.status(404).send('Blog not found');
    }
})

app.get('/readme',(req,res)=>{
    const rndmidx = Math.floor(Math.random()*blogs.length);
    if(rndmidx>=0){
        res.render("readme.ejs",{
            blogs:blogs[rndmidx]
        })
    }
else{
   res.status(404).send("Blog not found")
}
    res.render('readme.ejs');
})
app.get('/readme/:author',(req,res)=>{
    const author = req.params.author;
    const idx = blogs.findIndex((blog)=>blog.author == author);
    if(idx!=-1){
        res.render('readme.ejs',{
            blogs:blogs[idx]
        })
    }
    else{
        res.status(404).send('Blog not found');
    }
})


app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})

blogs.push( {
    author:"Sai Chithra",
    topic:"abc",
    heading:"Do You Drink water daily",
    blog:"Do You Drink Water Daily?Water is essential for life, yet many people don't drink enough of it daily. Our bodies are made up of about 60% water, and it plays a vital role in almost every bodily function. From regulating body temperature to aiding digestion, water is necessary for our overall health and well-being. Despite this, busy lifestyles or simply forgetting to hydrate can leave many of us falling short of our daily water intake.One of the primary functions of water is to help maintain the balance of bodily fluids. These fluids are responsible for digestion, circulation, nutrient transportation, and body temperature regulation. When we don’t consume enough water, dehydration can set in, leading to symptoms such as fatigue, headaches, and dizziness. Chronic dehydration may even contribute to more severe conditions like kidney stones or urinary tract infections.Water is also essential for maintaining healthy skin. Proper hydration keeps the skin looking fresh and prevents dryness. Additionally, staying hydrated aids in the removal of waste from the body through urine and sweat, helping to detoxify the system and support overall kidney function.How much water should we drink daily? While the traditional recommendation is eight glasses a day, the actual amount can vary depending on factors such as age, activity level, and climate. A good rule of thumb is to listen to your body. If you feel thirsty, it’s your body’s way of signaling that it needs hydration.In conclusion, drinking water daily is vital for staying healthy and energized. Prioritizing hydration can enhance physical and mental performance, improve mood, and promote long-term well-being. So, the next time you reach for a drink, consider making it a refreshing glass of water!",
    fileimg:"WATER-1600x900.avif"
},
{
    author:"BK_Moon and Lee Hyunmin",
    topic:"abc",
    heading:"The Greatest Estate Developer: A Review Of The Epic Journey",
    blog:"From the unique perspective inspired by “City-Builder” video games to the captivating tale of a young man who changes his own destiny, “The Greatest Estate Developer” may just be a masterpiece. In the world of manhwa, few stories manage to blend humor, adventure, and inspiration as seamlessly as “The Greatest Estate Developer.” If you are new to manga and manhwa, then be sure to check out our What is a Manhwa blog post to get started.Released in 2022, this series, written by BK_Moon and Lee Hyunmin, with illustrations by Kim Hyunsoo, takes readers on an unforgettable journey alongside its protagonist, Suho Kim. After a chance encounter with this hidden gem in my favorite bookstore, I was immediately drawn into Suho’s world—a world where engineering know-how meets fantasy and ambition meets reality.",
    fileimg:"The-Greatest-Estate-Developer-A-Review-Of-The-Epic-Journey.webp"
},

{
    author:"Vivek Narayan Sharma",
    topic:"abc",
    heading:"Ticket scalping: When prices soar and fans suffer",
    blog:"Ticket resale, also known as scalping or touting, is the art of flipping event tickets for prices that can make your wallet weep. Scalpers take advantage of high demand and limited supply, especially when popular events sell out faster than you can refresh the page. This shady side hustle is rampant in the world of concerts and sports, where tickets magically skyrocket in value—as if they’re attending the event themselves!Gone are the days when scalpers stood in line to snag tickets. Today, they’ve mastered the digital game. With automated bots that can snatch up tickets in bulk faster than any human finger can click, scalpers have evolved into virtual predators. These golden passes are then sold for heart-stopping prices, leaving fans with an impossible choice: pay up or miss out.",
    fileimg:"sfsdf.webp"
},
{
    author:"Chakraborthy Murthy",
    topic:"abc",
    heading:"Who won at the 68th National Film Awards - Complete Winners List",
    blog:"Established in 1954, initially as 'State Awards', the National Film Awards has come a long way and has become one of the highest accolades the film professionals in India receive today. Organized by the Directorate of Film Festivals, this year's awards were announced in New Delhi at National Media Centre. Due to the covid delays, this year's ceremony also honored films from 2020 across several categories. Filmmaker Vipul Shah led the 10-member jury for the year which also included cinematographer Dharam Gulati, National Award-winning Bengali actor Sreelekha Mukherjee, cinematographer GS Bhaskar, A Karthikraaja, VN Aditya, Viji Thampi, Sanjeev Rattan, S Thangadurai and Nishigandha.Check out the complete list of winners below:Feature Films:Best Feature Film: Soorarai Pottru (Tamil)Best Director: Sachy aka Sachidanandan KR for Ayyappanum Koshiyum (Malayalam)Best Popular Film Providing Wholesome Entertainment: Tanhaji (Hindi)Best Actor: Suriya for Soorarai Pottru (Tamil) and Ajay Devgn for Tanhaji (Hindi)Best Actress: Aparna Balamurali for Soorarai Pottru (Tamil)Best Supporting Actor: Biju Menon for Ayyappanum Koshiyam (Malayalam)Best Supporting Actress: Lakshmi Priya Chandramouli for Sivaranjaniyum Innam Sila Pengallum (Tamil)",
    fileimg:"movieawards.webp"
},
{
    author:"By Bstrilla Da Thrilla",
    topic:"abc",
    heading:"Get Your Diapers Ready",
    blog:"Los Angeles - What do you call a coach that goes for it 5 times in a game? Questionable. Making 4 of those 5? Lucky. Going for it on 4th and 2 with 1:47 left in the instead of kicking a field goal that would have put them in the lead and making it? Ballsy.Unfortunately for the defense, they were not playing an epic game as was the offense. To give the ball to Justin Herbert with that much time left and the defense being inept, Campbell took a chance on forth and 2 with a 6 yard strike from Jared Goff to Sam LaPorta. Goff then kneeled down 3 straight times to give kicker Riley Patterson ideal postion to kick the game winning, 41 yard field goal as time expired.Another thrilling Lions win that propels them to a 7-2 record and a #2 seed in the NFC Playoffs, currently.",
    fileimg:"sports1.jpg"
}
,
{
    author:"By SportsBlog News desk",
    topic:"abc",
    heading:"SportsBlog newsletter 11/20: Vivaaaa Las Vegas!",
    blog:"Every Monday morning, the SportsBlog staff sends a comprehensive email covering all the biggest news in the sporting world from the week that was.With three featured stories, a deeper look into NFL, NHL, NBA, MLB, and soccer news, a 'This Day in Sports History' section, and a 'Video of the Week,' the SportsBlog newsletter makes sure you never miss a story or crazy moment!If you want the newsletter delivered directly to your inbox every Monday, subscribe here! Share with a friend and enjoy!",
    fileimg:"sports2.jpg"
}
)
