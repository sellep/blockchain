
String.prototype.replaceAt = function(index, char)
{
    return `${this.substr(0, index)}${char}${this.substr(index + 1)}`;
};

Array.prototype.sum = function(func)
{
    // reduce alternative: this.reduce((t, e) => t += func(e), 0);

    let total = 0;

    for (let i = 0; i < this.length; i++)
    {
        total += func(this[i]);
    }

    return total;
};

Array.prototype.select = function(func)
{
    const arr = [];

    for (let i = 0; i < this.length; i++)
    {
        arr.push(func(this[i]));
    }

    return arr;
};