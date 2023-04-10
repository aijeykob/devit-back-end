#### Install
```
node version 16.13.2
npm install
```

#### Create .env File
You will find an example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. 
Fill in the variables to fit your application

#### Start a PostgreSQL database with docker using:
```bash
docker-compose up -d
```


#### Start the application
```
npm run dev-start
```


#### To create admin
```
npx sequelize-cli db:migrate
```

#### Admin credentials for front-end
```
superadmin@example.com
some-big-password
```