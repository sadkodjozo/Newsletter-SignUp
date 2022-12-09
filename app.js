const express = require('express');
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing')

const https = require('https');
const { response } = require('express');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

require('dotenv').config()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

//Mailchimp Config

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
});

const listId = process.env.LIST_ID;

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //const listId = process.env.LIST_ID;
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            //console.log(response);
            res.sendFile(__dirname + '/success.html');
            
        } catch (error) {
            console.log(error.status);
            res.sendFile(__dirname + '/failure.html')
        }
    };

    run();
});   

app.post('/failure', (req, res) => {
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port 3000');


});

