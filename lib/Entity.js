module.exports = Entity;

function Entity(id) {
    this.id = id;
    this.uniqId = null;
}

Entity.prototype.toString = function() {
    return "<Entity id=" + this.id + " unique-id=" + this.uniqId + ">";
}