#!/bin/bash

# Direct SQL method to set admin user
# Usage: ./scripts/setupAdminDirect.sh (run from backend directory)

cd "$(dirname "$0")/.." || exit 1

if [ ! -f .env ]; then
    echo "❌ .env not found in backend directory"
    exit 1
fi

# Load DATABASE_URL without breaking on quotes (avoid xargs)
DATABASE_URL=""
while IFS= read -r line; do
    [[ "$line" =~ ^#.*$ ]] && continue
    if [[ "$line" =~ ^DATABASE_URL= ]]; then
        DATABASE_URL="${line#DATABASE_URL=}"
        break
    fi
done < .env

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env"
    exit 1
fi

echo "🔧 Setting up admin user: keneniasefa14@gmail.com"
echo ""

psql "$DATABASE_URL" -c "UPDATE users SET role = 'admin' WHERE email = 'keneniasefa14@gmail.com';" || exit 1

echo ""
echo "✅ Verification:"
psql "$DATABASE_URL" -c "SELECT id, email, name, role FROM users WHERE email = 'keneniasefa14@gmail.com';"

echo ""
echo "🎉 Done! Sign in with keneniasefa14@gmail.com and visit /admin/dashboard"
