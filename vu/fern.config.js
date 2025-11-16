self.__uv$config = {
	prefix: '/~/',
	encodeUrl: Ultraviolet.codec.xor.encode,
	decodeUrl: Ultraviolet.codec.xor.decode,
	handler: '/vu/fern.handler.js',
	client: '/vu/fern.client.js',
	bundle: '/vu/fern.bundle.js',
	config: '/vu/fern.config.js',
	sw: '/vu/fern.sw.js'
}
