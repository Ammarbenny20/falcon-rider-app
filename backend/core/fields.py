from rest_framework import serializers


class LocationField(serializers.Field):
    """
    Serializes a PostGIS Point + a sibling `<field>_label` CharField
    into {"latitude": ..., "longitude": ..., "label": "..."}.
    Deserializes the same shape back into a Point + label.
    """

    def __init__(self, label_field_name=None, **kwargs):
        self.label_field_name = label_field_name
        super().__init__(**kwargs)

    def to_representation(self, value):
        if value is None:
            return None
        # value is a Point (or None). Label comes from the parent instance.
        instance = self.parent.instance if hasattr(self.parent, "instance") else None
        label = None
        if instance is not None and self.label_field_name:
            label = getattr(instance, self.label_field_name, None)
        return {
            "latitude": value.y,
            "longitude": value.x,
            "label": label,
        }

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError("Expected an object with latitude, longitude, label.")
        try:
            lat = float(data["latitude"])
            lng = float(data["longitude"])
        except (KeyError, TypeError, ValueError):
            raise serializers.ValidationError("latitude and longitude are required and must be numbers.")
        label = data.get("label")
        if label is not None and not isinstance(label, str):
            raise serializers.ValidationError("label must be a string.")
        return {"latitude": lat, "longitude": lng, "label": label}
