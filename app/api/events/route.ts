import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// Configure Cloudinary
if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 Configuring Cloudinary...');
  console.log('CLOUDINARY_URL exists:', !!process.env.CLOUDINARY_URL);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optionally log non-sensitive config details in non-prod only
if (process.env.NODE_ENV !== 'production') {
  const testConfig = cloudinary.config();
  console.log('✅ Cloudinary configured:', {
    cloud_name: testConfig.cloud_name,
    api_key: !!testConfig.api_key,
    api_secret: testConfig.api_secret ? 'set' : 'MISSING',
  });
}

export async function POST(req: NextRequest) {

    try {

        // Verify Cloudinary is properly configured
        const config = cloudinary.config();
        if (!config.cloud_name || !config.api_key || !config.api_secret) {
            console.error('Cloudinary config incomplete:', {
                cloud_name: config.cloud_name || 'MISSING',
                api_key: config.api_key || 'MISSING',
                api_secret: config.api_secret ? 'exists' : 'MISSING'
            });
            return NextResponse.json(
                { message: 'Cloudinary not properly configured' }, 
                { status: 500 }
            );
        }


        await connectDB();

        const formdata = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formdata.entries());

        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 }  )
        }

        const file = formdata.get('image') as File;

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 }  )

        let tags = JSON.parse(event.tags as string);
        let agenda = JSON.parse(event.agenda as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' , folder : "DevEvent" }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;


        
        
        const createdEvent = await Event.create({
            ...event,
            tags,
            agenda, 
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 }  )

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event creation failed' , error: e instanceof Error ? e.message : "Unknown" }, { status: 500 }  )

    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ events }, { status: 200 }  )
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch events' , error: e instanceof Error ? e.message : "Unknown" }, { status: 500 }  )
    }
}
