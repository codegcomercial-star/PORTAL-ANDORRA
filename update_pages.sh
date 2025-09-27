#!/bin/bash

# Directorio de páginas
PAGES_DIR="/workspaces/PORTAL-ANDORRA/apps/web/src/app/[locale]"

# Función para actualizar una página
update_page() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Actualizando: $file"
    
    # Crear archivo temporal con las modificaciones
    {
        # Agregar import de setRequestLocale si no existe
        if ! grep -q "setRequestLocale" "$file"; then
            sed '1s/^/import { setRequestLocale } from '\''next-intl\/server'\'';\n/' "$file" | \
            # Agregar interface Props si no existe
            sed '/export default function/i\
interface Props {\
  params: { locale: string };\
}\
' | \
            # Modificar la función para aceptar props y llamar setRequestLocale
            sed 's/export default function \([^(]*\)().*/export default function \1({ params: { locale } }: Props) {\
  setRequestLocale(locale);/'
        else
            cat "$file"
        fi
    } > "$temp_file"
    
    # Reemplazar el archivo original
    mv "$temp_file" "$file"
}

# Encontrar todas las páginas page.tsx excepto la principal (ya actualizada)
find "$PAGES_DIR" -name "page.tsx" -not -path "$PAGES_DIR/page.tsx" | while read -r file; do
    update_page "$file"
done

echo "Actualización completa"