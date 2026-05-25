import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      // Check if business profile exists for this user
      const { data: existingBusiness, error: businessError } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (businessError && businessError.code !== "PGRST116") {
        // PGRST116 means no rows returned, which is okay for new user
        console.error("Error checking business profile:", businessError);
      }

      if (!existingBusiness) {
        // Create a default business profile for new user
        const slugify = (text: string) =>
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

      const baseName = user.email?.split("@")[0] || "My Business";
      const slug = slugify(baseName);
      
      // Ensure slug is unique by appending user id substring if needed
      const { data: slugCheck } = await supabase
        .from("businesses")
        .select("slug")
        .eq("slug", slug)
        .single();

      const finalSlug = slugCheck ? `${slug}-${user.id.substring(0, 8)}` : slug;

      await supabase.from("businesses").insert({
        user_id: user.id,
        name: baseName,
        slug: finalSlug,
        industry: "general",
      });
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
