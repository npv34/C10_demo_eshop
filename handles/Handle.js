const BaseHandle = require("./BaseHandle");
const url = require("url");
const qs = require("qs");

class Handle extends BaseHandle{
    async showDashboard(req, res) {
        let html = await this.getTemplate('./src/view/dashboard.html');
        res.write(html)
        res.end();
    }

    async showListUsers(req, res){
        let html = await this.getTemplate('./src/view/users/list.html');
        // truy van csdl
        let sql = 'SELECT id, name, username, email, role, phone FROM users';
        let users = await this.querySQL(sql);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        users.forEach((user, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td>${user.name}</td>`;
            newHTML += `<td>${user.username}</td>`;
            newHTML += `<td>${user.email}</td>`;
            newHTML += `<td>${(user.role == 1) ? 'admin' : 'user'}</td>`;
            newHTML += `<td>${user.phone}</td>`;
            newHTML += `<td><a onclick="return confirm('Are you sure you want to delete this user?')" href="/admin/users/delete?id=${user.id}" class="btn btn-danger">Delete</a></td>`;

            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-user}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async deleteUser(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'DELETE FROM users WHERE id = ' + id;
        await this.querySQL(sql);
        res.writeHead(301, {Location: '/admin/users'});
        res.end();
    }

    async showFormCreateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/add.html');
        res.write(html)
        res.end();
    }

    async storeUser(req, res) {
        // lay du  lieu tu  form
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL addUser('${dataForm.name}','${dataForm.username}', '${dataForm.email}', '${dataForm.password}', '${dataForm.role}', '${dataForm.phone}', '${dataForm.address}')`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })

    }
}

module.exports = new Handle();
