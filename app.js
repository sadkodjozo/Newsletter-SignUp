const express = require('express');
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing')

const https = require('https');
const { response } = require('express');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

//Mailchimp Config

mailchimp.setConfig({
    apiKey: "7c235ef3ce9d00b59411028bad32da92-us13",
    server: "us13"
});


// POST REQUEST
app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const listId = '76691ecaca';
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

            console.log(response);
            res.sendFile(__dirname + '/success.html');
            
        } catch (error) {
            console.log(error.status);
            res.sendFile(__dirname + '/failure.html')
        }
    };

    run();
});   //End of POST REQUEST

app.post('/failure', (req, res) => {
    res.redirect('/');
});


//Listening
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port $3000');


});



// 7c235ef3ce9d00b59411028bad32da92-us13


// 76691ecaca