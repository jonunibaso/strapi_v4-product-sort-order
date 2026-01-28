import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@strapi/design-system";
import { useFetchClient, useNotification } from "@strapi/helper-plugin";

export default function App() {
  const { get, post } = useFetchClient();
  const toggleNotification = useNotification();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const ids = useMemo(() => items.map((p) => p.id), [items]);

  async function load() {
    setLoading(true);
    try {
      const res = await get("/product-sort-order/products");
      const data = res?.data?.data || [];
      // Normaliza (por si sortOrder viene null)
      const normalized = data.map((p, i) => ({
        ...p,
        sortOrder: p.sortOrder ?? i + 1,
      }));
      setItems(normalized);
      setDirty(false);
    } catch (e) {
      toggleNotification({
        type: "warning",
        message: { id: "product-sort-order.load.error", defaultMessage: "Error cargando productos" },
      });
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    // recalcula sortOrder en memoria (solo visual)
    const re = next.map((p, idx) => ({ ...p, sortOrder: idx + 1 }));
    setItems(re);
    setDirty(true);
  }

  function onDragStart(e, index) {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e, toIndex) {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex)) return;
    move(fromIndex, toIndex);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function save() {
    setSaving(true);
    try {
      await post("/product-sort-order/products/reorder", { ids });
      toggleNotification({
        type: "success",
        message: { id: "product-sort-order.save.ok", defaultMessage: "Orden guardado" },
      });
      setDirty(false);
      await load(); // recarga desde BD
    } catch (e) {
      toggleNotification({
        type: "warning",
        message: { id: "product-sort-order.save.error", defaultMessage: "Error guardando el orden" },
      });
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box padding={6}>
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Box>
          <Typography variant="alpha">Orden productos</Typography>
          <Typography textColor="neutral600">
            Arrastra filas para reordenar. Luego pulsa “Guardar”.
          </Typography>
        </Box>

        <Flex gap={2}>
          <Button variant="tertiary" onClick={load} disabled={loading || saving}>
            Recargar
          </Button>
          <Button onClick={save} disabled={!dirty || saving || loading}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </Flex>
      </Flex>

      <Box background="neutral0" hasRadius shadow="tableShadow" padding={4}>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : (
          <Table colCount={4} rowCount={items.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Orden</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Título</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Slug</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Estado</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((p, index) => (
                <Tr
                  key={p.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, index)}
                  style={{ cursor: "grab" }}
                >
                  <Td>
                    <Typography>{p.sortOrder}</Typography>
                  </Td>
                  <Td>
                    <Typography fontWeight="semiBold">{p.Title || `#${p.id}`}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral600">{p.Slug || "-"}</Typography>
                  </Td>
                  <Td>
                    {dirty ? <Badge backgroundColor="warning100" textColor="warning700">Sin guardar</Badge> : <Badge>OK</Badge>}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
