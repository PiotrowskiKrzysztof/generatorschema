// module.exports = {
//     index(req, res) {
//         res.send('Strona główna');
//         // res.render('index.html');
//     }
// }

module.exports = {
    index(req, res) {
        // res.send('Strona główna');
        res.sendFile(path.join(__dirname, '/frontend/build'));
    }
}

