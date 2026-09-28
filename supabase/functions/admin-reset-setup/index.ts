import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    // Step 1: Delete all auth users
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    let deletedCount = 0;
    if (!listError && listData?.users) {
      for (const user of listData.users) {
        const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
        if (!delErr) deletedCount++;
      }
    }

    // Step 2: Clean profiles
    await supabase.from("profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Step 3: Create admin
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: "admin1@gmail.com",
      password: "zxczxc123",
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });

    if (createErr) {
      return new Response(JSON.stringify({
        success: true,
        deletedUsers: deletedCount,
        adminCreated: false,
        error: createErr.message
      }), { status: 200, headers });
    }

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
      adminEmail: "admin1@gmail.com",
      message: `Done! Deleted ${deletedCount} users. Created admin: admin1@gmail.com`
    }), { status: 201, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers });
  }
});