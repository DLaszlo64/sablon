import express from "express"
import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const PORT = 3000
const app = express()

app.use(express.json())

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

app.get("/", (req, res) =>{
    res.send("Müködik a server")
})

app.get("/termekek", (req, res) =>{
    try{
        pool.query("SELECT termekek.id, termekek.nev, ar, keszlet, elerheto, kategoriak.nev FROM `kategoriak`, termekek WHERE(kategoriak.id = termekek.kategoria_id) ORDER BY termekek.ar ASC", (err, ressult)=> {
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.get("/termekek/elerheto", (req, res) =>{
    try{
        pool.query("SELECT * FROM `termekek` WHERE(elerheto = 1)", (err, ressult)=> {
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})


app.get("/termekek/kerese/:szoveg", (req, res) =>{
    try{
        pool.query(`SELECT * FROM termekek WHERE(nev like "%fej%");`, (err, ressult)=> {
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})


app.get("/kategoriak/statisztika", (req, res) =>{
    try{
        pool.query(`SELECT kategoriak.nev, termekek.keszlet, AVG(termekek.ar) as "atlagos_ar" FROM kategoriak, termekek WHERE(kategoriak.id = termekek.kategoria_id) GROUP BY kategoriak.nev;`, (err, ressult)=> {
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.get("/termekek/dragak", (req, res) =>{
    try{
        pool.query(`SELECT nev, ar, keszlet FROM termekek WHERE(10000 < ar) ORDER by keszlet DESC;`, (err, ressult)=> {
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})

app.post("/api/users", async (req, res) =>{
    try{
        const query = "INSERT INTO kategoriak(id, nev) values(?, ?)"
        const [ressult] = await pool.query(query, ["4", "Aszal"])
        res.status(201).json({message: "Felhasznalo sikeresen hozzáadva", id: ressult.insertId})
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})


app.listen(PORT, () =>{
    console.log(`Server fut http://localhost:${PORT}`)
})