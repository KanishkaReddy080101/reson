import S3 from 'aws-sdk/clients/s3'
// import { randomUUID } from "crypto";


export default async function handler(req,res) {
    const s3 = new S3({
        signatureVersion: 'v4',
        region: 'Europe (Frankfurt) eu-central-1',
        accessKeyId: 'AKIA5FTZEE4RFEEHWNNQ',
        secretAccessKey: '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',
    })

    // const ex = (req.query.file).split("/")[1];
    // const Key = `${randomUUID()}.${ex}`;

    const Key = req.query.key;

    const s3Params = {
        Bucket: 'reson-videos',
        Key: req.query.folder + '/' + Key,
        Expires: 6000,
    };

    const preSignedUrl = await s3.getSignedUrlPromise("getObject", s3Params)

    res.status(200).json({
        "durl": preSignedUrl,
        "dkey": Key
    })
}