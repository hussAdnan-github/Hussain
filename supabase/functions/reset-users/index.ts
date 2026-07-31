import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
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
    // List all users
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (listError) {
      console.error("List users error:", listError);
      return new Response(JSON.stringify({ error: "Failed to list users: " + listError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const users = listData?.users || [];
    const deletedIds: string[] = [];

    // Delete each user one by one
    for (const user of users) {
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
      if (delError) {
        console.error(`Failed to delete user ${user.id}:`, delError.message);
      } else {
        deletedIds.push(user.id);
      }
    }

    // Clean up profiles table for deleted users
    if (deletedIds.length > 0) {
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .in("id", deletedIds);

      if (profileError) {
        console.error("Profile cleanup error:", profileError.message);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      totalUsers: users.length,
      deleted: deletedIds.length,
      message: `Deleted ${deletedIds.length} out of ${users.length} users`,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error: " + (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});