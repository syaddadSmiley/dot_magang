const config = require('../config/appconfig')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = config.auth.aes_secret;
const iv = crypto.randomBytes(16);

class CryptoX {
	static async encryptX(text) {
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
	}

	static async decrypt(text) {
		var textParse = JSON.parse(text);
		let iv = Buffer.from(textParse.iv, 'hex');
		let encryptedText = Buffer.from(textParse.encryptedData, 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	   }
}

module.exports = CryptoX;