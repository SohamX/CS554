import gm from 'gm';
import { promisify } from 'util';

const gmInstance = gm.subClass({ imageMagick: true });


const toBufferAsync = promisify((buffer, callback) => {
    gmInstance(buffer)
        .resize(1080, 1920)  
        .background('white') 
        .gravity('Center')   
        .extent(1080, 1920)  
        .toBuffer('JPEG', callback);
});

async function resizeImage(buffer) {
    return await toBufferAsync(buffer);
}

export default resizeImage;