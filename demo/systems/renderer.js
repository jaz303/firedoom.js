def('title', 'Renderer');
def('rank', 90);

def('update', function(clock) {
	var ctx = this.ctx;
	for (var k in this.entities) {
		var entity = this.entities[k];
		ctx.drawImage(
			IMAGES[entity.image.image],
			entity.position.x,
			entity.position.y
		);
	}
});

def('acceptsEntity', function(entity) {
	return entity.position && entity.image;
});