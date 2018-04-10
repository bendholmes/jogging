from rest_framework import serializers
import bleach


class SafeCharField(serializers.CharField):
    """
    A serializer CharField that automatically performs input sanitation to avoid XSS attacks. We do this on input
    rather than output as storing anything potentially malicious in the database is a bad idea as this then requires
    the sanitization to be applied almost everywhere the data is used.
    """
    def to_internal_value(self, data):
        """
        Returns a sanitized version of the data.
        :param data: The data to be sanitized.
        :return: Sanitized data.
        """
        return bleach.clean(data)
