const http = require('http');
const url = require('url');
const Handler = require('./handles/Handle')

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const methodRequest = req.method;

    // xu ly router
    switch (pathName) {
        case '/admin':
            Handler.showDashboard(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users':
            Handler.showListUsers(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users/delete':
            Handler.deleteUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/create':
            Handler.showFormCreateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/store':
            Handler.storeUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        default:
            res.end();
    }

})

server.listen(8000, 'localhost', () => {
    console.log('server listening on port' + 8000)
})
