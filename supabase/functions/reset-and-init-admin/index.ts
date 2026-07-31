import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // Step 1: List and delete all users from auth
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (listError) {
      return new Response(JSON.stringify({ error: "Failed to list users: " + listError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const users = listData?.users || [];
    let deletedCount = 0;

    for (const user of users) {
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
      if (!delError) {
        deletedCount++;
      }
    }

    // Step 2: Clean profiles table
    const { error: profileDelError } = await supabase.from("profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (profileDelError) {
      console.error("Profile cleanup error:", profileDelError);
    }

    // Step 3: Create new admin
    const adminEmail = "admin1@gmail.com";
    const adminPassword = "zxczxc123";

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });

    if (createError) {
      return new Response(JSON.stringify({
        success: true,
        deletedUsers: deletedCount,
        adminCreated: false,
        error: "Admin creation failed: " + createError.message,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Step 4: Insert profile for admin
    if (newUser.user) {
      await supabase.from("profiles").insert({
        id: newUser.user.id,
        full_name: "Admin",
        avatar_url: "",
        bio: "",
        role: "admin",
      });
    }

    return new Response(JSON.stringify({
      success: true,
      deletedUsers: deletedCount,
      adminCreated: true,
      adminEmail: adminEmail,
      message: "Deleted " + deletedCount + " users. Created admin: " + adminEmail,
    }), {
      status: 201,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error: " + (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});