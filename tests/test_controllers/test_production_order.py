import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_create_production_order_success(client: AsyncClient):
    resp = await client.post(
        "/api/v1/production-orders/",
        json={"order_no": "PO-001", "product_name": "Widget A", "qty_plan": 100.0},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["success"] is True
    assert body["data"]["order_no"] == "PO-001"
    assert body["data"]["status"] == "planned"


@pytest.mark.anyio
async def test_create_production_order_duplicate(client: AsyncClient):
    payload = {"order_no": "PO-DUP", "product_name": "Widget B", "qty_plan": 50.0}
    await client.post("/api/v1/production-orders/", json=payload)
    resp = await client.post("/api/v1/production-orders/", json=payload)
    assert resp.status_code == 409
    assert resp.json()["error_code"] == "DUPLICATE"


@pytest.mark.anyio
async def test_get_production_order_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/production-orders/9999")
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_start_production_flow(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/production-orders/",
        json={"order_no": "PO-FLOW", "product_name": "Widget C", "qty_plan": 200.0},
    )
    order_id = create_resp.json()["data"]["id"]

    start_resp = await client.post(f"/api/v1/production-orders/{order_id}/start")
    assert start_resp.status_code == 200
    assert start_resp.json()["data"]["status"] == "in_progress"

    complete_resp = await client.post(f"/api/v1/production-orders/{order_id}/complete")
    assert complete_resp.status_code == 200
    assert complete_resp.json()["data"]["status"] == "completed"
