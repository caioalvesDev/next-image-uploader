import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    const { data, error } = await supabase.storage
      .from("images")
      .upload(file.name, file, {
        upsert: true,
      });

    if (error)
      throw new Error("An error ocurred while uploading the image");

    const { data: imageUrl } = supabase.storage
      .from("images")
      .getPublicUrl(data?.path);
    
    return Response.json(
      {
        imageUrl: imageUrl.publicUrl,
      },
      {
        status: 201
      }
    )
  } catch (error) {
    if(error instanceof Error) {
      return Response.json({ error: error.message })
    }
  }
}