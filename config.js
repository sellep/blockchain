const fs = require('fs');

const DIFFICULTY = 3;
const MINE_RATE = 60000;
const REWARD = 5;

const path = `${process.env.HOME}/.bcconfig`;

class Config
{

    static peers(write)
    {
        ensureConfigDirectory();

        const peersFile = `${path}/peers`;

        if (write)
        {
            fs.writeFileSync(peersFile, write);
        }
        else if (fs.existsSync(peersFile))
        {
            console.log(fs.lstatSync(peersFile));
        }
    }

    static blockchain(write)
    {
        ensureConfigDirectory();

        const chainFile = `${path}/chain`;

        if (write)
        {            
            fs.writeFileSync(chainFile, JSON.stringify(write));
        }
        else if (fs.existsSync(chainFile))
        {
            return JSON.parse(fs.readFileSync(chainFile));
        }
    }

    static difficulty()
    {
        return DIFFICULTY;
    }

    static reward()
    {
        return REWARD;
    }

    static rate()
    {
        return MINE_RATE;
    }
}

function ensureConfigDirectory()
{
    if (!fs.existsSync(path))
    {
        fs.mkdirSync(path);
    }
}

module.exports = Config;
