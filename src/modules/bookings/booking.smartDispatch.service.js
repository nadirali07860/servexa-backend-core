const pool = require('../../core/database');

async function smartDispatch(serviceId, societyId, customerLat, customerLng) {

  const result = await pool.query(

`
SELECT
t.user_id,
t.active_bookings,
t.rating,
t.reputation_score,
tl.latitude,
tl.longitude,

(
6371 * acos(
cos(radians($3))
* cos(radians(tl.latitude))
* cos(radians(tl.longitude) - radians($4))
+ sin(radians($3))
* sin(radians(tl.latitude))
)
) AS distance

FROM technicians t

JOIN technician_services ts
ON ts.technician_id = t.user_id

JOIN technician_locations tl
ON tl.technician_id = t.user_id

WHERE
ts.service_id = $1
AND t.status = 'AVAILABLE'
AND t.is_online = true

ORDER BY
distance ASC,
t.active_bookings ASC,
t.rating DESC

LIMIT 1

`,
[serviceId, societyId, customerLat, customerLng]

);

if (!result.rows.length) {
return null;
}

return result.rows[0].user_id;

}

module.exports = { smartDispatch };
