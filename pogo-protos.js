const path = require('path');
const protobuf = require('protobufjs');

// Load protobuf definitions
const root = protobuf.loadSync(path.join(__dirname, 'proto', 'POGOProtos.proto'));

// Add custom functionality
const POGOProtos = {
  ...root,
  
  // Modern serialization
  serialize(obj, messageType) {
    const Message = root.lookupType(messageType);
    return Message.encode(obj).finish();
  },

  // Modern deserialization
  deserialize(buffer, messageType) {
    const Message = root.lookupType(messageType);
    return Message.decode(buffer);
  },

  // Enhanced parseWithUnknown with proper unknown field handling
  parseWithUnknown(buffer, messageType) {
    try {
      const Message = root.lookupType(messageType);
      const decoded = Message.decode(buffer);
      
      // In protobuf.js v6+, unknown fields are automatically preserved
      // and can be accessed via $unknownFields if needed
      return decoded;
    } catch (e) {
      console.error('Protobuf parsing failed:', e);
      throw new Error(`Failed to parse ${messageType}: ${e.message}`);
    }
  },

  // Backward compatibility
  proto: root
};

// Add type definitions directly to main object
Object.assign(POGOProtos, root.nested);

module.exports = POGOProtos;